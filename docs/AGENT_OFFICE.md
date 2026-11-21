# Escritório de Agentes — revisão antes de subir

Este fluxo garante que nenhuma mudança seja commitada, enviada ou aberta como PR
sem passar por revisão de segurança e de build. As regras completas estão em
[`AGENTS.md`](../AGENTS.md).

## Papéis

| Papel | Onde está | Responsabilidade |
| --- | --- | --- |
| Implementador / Arquiteto | agente principal (`build` ou `office-lead`) | Implementa o escopo e faz auto-revisão. |
| Segurança & Qualidade | `.opencode/agents/security-reviewer.md` | Segredos, arquivos sensíveis, validação, erros, edge cases, escopo e regressões. Somente leitura. |
| Testes & Build | `.opencode/agents/build-reviewer.md` | Tipos, build, lint e testes no escopo alterado. Não edita arquivos. |
| Orquestrador | `.opencode/agents/office-lead.md` | Executa a mudança e exige aprovação dos dois revisores. |

## Fluxo

```text
0. Verificar a branch atual
   └── se for main → criar branch de trabalho antes de qualquer edição/commit
1. Implementar a mudança
2. Auto-revisar contra AGENTS.md
3. security-reviewer → relatório por severidade
4. build-reviewer / scripts/agent-review.sh → evidência de comandos
5. Existe bloqueio crítico ou alto?
   ├── sim → corrigir e voltar ao passo 2
   └── não → pronto para commit/push/PR (se pedido explicitamente)
```

> **Nunca commitar direto na `main`.** Todo trabalho deve ser feito em branch e
> chegar à `main` por Pull Request revisado.

## Gate local

```bash
# Revisão completa do estado local
npm run review:agents

# Revisão do diff em relação à main
bash scripts/agent-review.sh --base origin/main

# Só segurança
bash scripts/agent-review.sh --only security --base origin/main

# Só tipos/build/lint/testes
bash scripts/agent-review.sh --only quality --base origin/main

# Estrito: lint e testes completos (inclui dívida antiga)
npm run review:agents:strict
```

O script:

- bloqueia arquivos sensíveis versionados ou alterados (`.env`, `auth/`, bancos,
  chaves);
- procura padrões de credenciais nos arquivos alterados;
- roda typecheck, build backend, build frontend;
- roda ESLint nos arquivos alterados;
- roda testes Jest relacionados às alterações do backend;
- retorna `1` se houver qualquer bloqueio.

## No OpenCode

Selecione o agente `office-lead` (ou peça ao agente principal para usar os
subagentes):

```text
Use o security-reviewer e o build-reviewer para revisar as alterações atuais
antes de eu commitar.
```

Os revisores são somente leitura. O `build-reviewer` pode executar comandos de
verificação, mas não editar arquivos.

## No GitHub Actions

`.github/workflows/agent-office-review.yml` roda em:

- `pull_request`;
- `push` para `main`.

Jobs:

1. **Segurança & Qualidade** — `agent-review.sh --only security`.
2. **Testes & Build** — instala dependências e roda
   `agent-review.sh --only quality`.

O workflow tem `permissions: contents: read` e não faz push, comentário ou merge.

## Checklist de aprovação

- [ ] Branch de trabalho criada; nenhum commit direto na `main`.
- [ ] Nenhum segredo, token ou `.env` real no diff.
- [ ] `auth/`, bancos SQLite e artefatos de build fora do commit.
- [ ] Escopo da mudança respeitado, sem refatoração solta.
- [ ] Entradas validadas e erros tratados explicitamente.
- [ ] Tipos e build passando.
- [ ] Lint dos arquivos alterados passando.
- [ ] Testes relacionados passando (backend).
- [ ] Risco residual e verificações manuais registrados.
- [ ] Commit/push/PR só após pedido explícito.

## Limitações atuais

- O frontend não possui runner de testes; a validação é build + revisão manual.
- Existe dívida antiga de lint no backend e no frontend. O gate padrão usa
  escopo alterado; se um arquivo legado for tocado, a dívida nele ainda bloqueia.
  `--strict` é o alvo futuro.
- A pasta literal `whatsapp-financas-web/@/` é legada e não deve ser removida sem
  autorização.
