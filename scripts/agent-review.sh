#!/usr/bin/env bash
# Gate local/CI do Escritório de Agentes do FinAI.
#
# Uso:
#   bash scripts/agent-review.sh                         # revisão completa (working tree + staged)
#   bash scripts/agent-review.sh --base origin/main      # revisão do que seria enviado à main
#   bash scripts/agent-review.sh --only security         # apenas segurança
#   bash scripts/agent-review.sh --only quality          # apenas tipos/build/lint/testes
#   bash scripts/agent-review.sh --strict                # lint e testes completos (não só alterados)
#
# Códigos de saída:
#   0 = aprovado
#   1 = bloqueio (corrigir antes de commit/push/PR)
#   2 = uso incorreto

set -uo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR" || exit 1

ONLY="all"
BASE_REF=""
STRICT=0
FAILURES=0
WARNINGS=0

declare -A REPORTED_SENSITIVE=()

usage() {
  cat <<'EOF'
Uso: bash scripts/agent-review.sh [opções]

Opções:
  --base <ref>        Compara a revisão com uma referência Git (ex.: origin/main).
  --only <etapa>      security | quality | all (padrão: all).
  --strict            Roda lint e testes completos, não apenas os arquivos alterados.
  -h, --help          Mostra esta ajuda.

Exemplos:
  bash scripts/agent-review.sh --base origin/main
  bash scripts/agent-review.sh --only security --base origin/main
  bash scripts/agent-review.sh --only quality --base origin/main
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base)
      BASE_REF="${2:-}"
      shift 2
      ;;
    --base=*)
      BASE_REF="${1#*=}"
      shift
      ;;
    --only)
      ONLY="${2:-}"
      shift 2
      ;;
    --only=*)
      ONLY="${1#*=}"
      shift
      ;;
    --strict)
      STRICT=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Argumento desconhecido: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

case "$ONLY" in
  all|security|quality) ;;
  *)
    echo "Valor inválido para --only: $ONLY (use security, quality ou all)" >&2
    exit 2
    ;;
esac

section() {
  printf '\n== %s ==\n' "$1"
}

ok() {
  printf '  ✔ %s\n' "$1"
}

warn() {
  WARNINGS=$((WARNINGS + 1))
  printf '  ⚠ %s\n' "$1"
}

block() {
  FAILURES=$((FAILURES + 1))
  printf '  ✖ %s\n' "$1"
}

if [[ -n "$BASE_REF" ]] && ! git rev-parse --verify --quiet "${BASE_REF}^{commit}" >/dev/null; then
  warn "Referência base '$BASE_REF' não encontrada; usando apenas alterações locais."
  BASE_REF=""
fi

collect_changed_files() {
  if [[ -n "$BASE_REF" ]]; then
    git diff --name-only --diff-filter=ACMR "${BASE_REF}...HEAD" 2>/dev/null || true
  fi

  git diff --name-only --diff-filter=ACMR 2>/dev/null || true
  git diff --cached --name-only --diff-filter=ACMR 2>/dev/null || true
  git ls-files --others --exclude-standard 2>/dev/null || true
}

mapfile -t CHANGED < <(collect_changed_files | sed '/^$/d' | sort -u)

is_sensitive_path() {
  local file="$1"

  [[ "$file" == ".env.example" ]] && return 1
  [[ "$file" == ".env" || "$file" == .env.* ]] && return 0
  [[ "$file" =~ (^|/)(auth|auth_info|sessions)/ ]] && return 0
  [[ "$file" =~ \.(db|db-journal|pem|key|p12|pfx)$ ]] && return 0

  return 1
}

report_sensitive() {
  local file="$1" reason="$2"

  if [[ -z "${REPORTED_SENSITIVE[$file]:-}" ]]; then
    REPORTED_SENSITIVE["$file"]=1
    block "$reason: $file"
  fi
}

run_security_review() {
  section "Revisor de Segurança & Qualidade — segredos e arquivos sensíveis"

  local file

  # 1. Arquivos sensíveis que já estejam versionados.
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    if is_sensitive_path "$file"; then
      report_sensitive "$file" "Arquivo sensível versionado (remova do Git)"
    fi
  done < <(git ls-files 2>/dev/null || true)

  # 2. Arquivos sensíveis alterados/novos no diff revisado.
  for file in "${CHANGED[@]}"; do
    if is_sensitive_path "$file"; then
      report_sensitive "$file" "Arquivo sensível alterado (não faça commit)"
    fi
  done

  # 3. Padrões de credenciais em conteúdo alterado.
  local secret_pattern
  secret_pattern="(-----BEGIN [A-Z ]*PRIVATE KEY-----|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{32,}|(api[_-]?key|secret|token|password|passwd|client[_-]?secret|private[_-]?key)[[:space:]]*[:=][[:space:]]*[\"'][^\"'[:space:]]{12,}[\"'])"

  local match lower
  for file in "${CHANGED[@]}"; do
    [[ -f "$file" ]] || continue
    is_sensitive_path "$file" && continue

    case "$file" in
      package-lock.json|*/package-lock.json|dist/*|*/dist/*|coverage/*|*/coverage/*)
        continue
        ;;
    esac

    # Ignora binários.
    grep -Iq . "$file" 2>/dev/null || continue

    while IFS= read -r match; do
      lower="$(printf '%s' "$match" | tr '[:upper:]' '[:lower:]')"
      case "$lower" in
        *seu_*|*sua_*|*your_*|*example*|*exemplo*|*changeme*|*placeholder*|*'<...>'*|*'{env:'*|*'process.env'*|*token_aqui*|*xxxx*)
          continue
          ;;
      esac

      block "Possível segredo em $file: $match"
    done < <(grep -nIE "$secret_pattern" "$file" 2>/dev/null || true)
  done

  if [[ "$FAILURES" -eq 0 ]]; then
    ok "Nenhum segredo ou arquivo sensível detectado no escopo revisado."
  fi
}

run_check() {
  local label="$1"
  shift

  printf '  → %s\n' "$label"
  if "$@"; then
    ok "$label"
  else
    block "$label"
  fi
}

run_quality_review() {
  section "Revisor de Testes & Build — tipos, compilação, lint e testes"

  run_check "Typecheck backend (tsc --noEmit)" npm run typecheck
  run_check "Build backend (nest build)" npm run build
  run_check "Build frontend (tsc -b + vite build)" bash -c "cd whatsapp-financas-web && npm run build"

  local file
  local -a backend_lint=()
  local -a frontend_lint=()
  local -a backend_tests=()

  for file in "${CHANGED[@]}"; do
    case "$file" in
      whatsapp-financas-web/@/*)
        warn "Lint ignorado para a pasta literal @/ (arquivo legado): $file"
        ;;
      whatsapp-financas-web/*)
        if [[ "$file" =~ \.(ts|tsx)$ ]]; then
          frontend_lint+=("${file#whatsapp-financas-web/}")
        fi
        ;;
      src/*)
        if [[ "$file" =~ \.ts$ ]]; then
          backend_lint+=("$file")
          backend_tests+=("$file")
        fi
        ;;
      test/*)
        warn "Lint não aplicado a $file (fora do projectService do ESLint); testes e2e rodam à parte."
        ;;
    esac
  done

  if [[ "$STRICT" -eq 1 ]]; then
    run_check "ESLint backend completo" npx eslint "{src,apps,libs,test}/**/*.ts"
    run_check "ESLint frontend completo" bash -c "cd whatsapp-financas-web && npm run lint"
  else
    if [[ ${#backend_lint[@]} -gt 0 ]]; then
      run_check "ESLint backend (arquivos alterados)" npx eslint "${backend_lint[@]}"
    else
      warn "Nenhum arquivo TypeScript do backend alterado; ESLint backend não executado."
    fi

    if [[ ${#frontend_lint[@]} -gt 0 ]]; then
      printf '  → %s\n' "ESLint frontend (arquivos alterados)"
      if (cd whatsapp-financas-web && npx eslint "${frontend_lint[@]}"); then
        ok "ESLint frontend (arquivos alterados)"
      else
        block "ESLint frontend (arquivos alterados)"
      fi
    else
      warn "Nenhum arquivo TypeScript/TSX do frontend alterado; ESLint frontend não executado."
    fi
  fi

  if [[ "$STRICT" -eq 1 ]]; then
    run_check "Testes backend completos" npm test -- --runInBand
  elif [[ ${#backend_tests[@]} -gt 0 ]]; then
    run_check "Testes backend relacionados às alterações" npx jest --runInBand --findRelatedTests --passWithNoTests "${backend_tests[@]}"
  else
    warn "Nenhum arquivo TypeScript do backend alterado; testes backend não executados."
  fi

  warn "O frontend (whatsapp-financas-web) não possui runner de testes configurado; cobertura manual necessária."
}

printf 'FinAI — Escritório de Agentes (revisão antes de subir)\n'
printf 'Escopo: %s | Base: %s | Arquivos alterados: %d | Modo: %s\n' \
  "$ONLY" "${BASE_REF:-working tree}" "${#CHANGED[@]}" \
  "$([[ "$STRICT" -eq 1 ]] && echo estrito || echo alterados)"

if [[ "$ONLY" == "all" || "$ONLY" == "security" ]]; then
  run_security_review
fi

if [[ "$ONLY" == "all" || "$ONLY" == "quality" ]]; then
  run_quality_review
fi

section "Resultado do gate"
printf 'Bloqueios: %d | Avisos: %d\n' "$FAILURES" "$WARNINGS"

if [[ "$FAILURES" -gt 0 ]]; then
  printf 'REPROVADO: corrija os bloqueios antes de commit/push/PR.\n'
  exit 1
fi

printf 'APROVADO: nenhum bloqueio encontrado.\n'
