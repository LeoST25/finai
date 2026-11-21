# AGENTS.md — Instruções para agentes de codificação do FinAI

Este arquivo é a fonte de verdade para qualquer agente (humano ou IA) que altere
este repositório. Ele é carregado automaticamente pelo OpenCode. Leia também
`docs/AGENT_OFFICE.md` para o fluxo operacional do escritório de revisão.

## 1. Contexto real da stack e da arquitetura

O repositório é um monorepo simples com backend e frontend no mesmo diretório
raiz:

```text
finai/
├── src/                         # Backend NestJS 11 + TypeScript
├── prisma/                      # Schema, migrations e dev.db (SQLite)
├── test/                        # Configuração Jest e2e
├── whatsapp-financas-web/       # Frontend React 19 + Vite + TypeScript
├── scripts/agent-review.sh      # Gate local do escritório de agentes
├── .opencode/agents/            # Papéis do escritório para o OpenCode
└── .github/workflows/           # Automação de revisão em PR/push
```

### Backend (`src/`)

- **NestJS 11** com `ConfigModule` global carregando `.env`.
- Módulos registrados em `src/app.module.ts`:
  - `HealthModule` — `GET /health`.
  - `ExpensesModule` — CRUD de lançamentos em `/expenses`.
  - `WhatsappModule` — integração Baileys, parsing e comandos do WhatsApp.
  - `ReportsModule` — resumo diário via cron às 20h (`ReportsSchedulerService`).
  - `AiModule` — escritório de agentes em `/ai`.
  - `PrismaModule` — `PrismaService` compartilhado.
- `src/sheets/` existe, mas é um serviço vazio e não está conectado ao
  `AppModule`; não presuma que ele faz integração com Google Sheets.
- `src/common/http-response.ts` e `src/types/qrcode-terminal.d.ts` são utilitários
  isolados.
- Controllers e rotas existentes:
  - `GET /` — `AppController`.
  - `GET /health`.
  - `POST /expenses`, `GET /expenses`, `GET /expenses/:id`,
    `PUT /expenses/:id`, `DELETE /expenses/:id`.
  - `GET /ai/office`, `POST /ai/agents/run`, `POST /ai/office/standup`.
  - Swagger em `/api`.
- `ReportsModule` não expõe controller HTTP; ele roda por cron e usa
  `WhatsappService.sendMessage`.
- A integração WhatsApp só inicia quando `WHATSAPP_ENABLED=true`. A pasta
  `auth/` contém a sessão do Baileys, é ignorada pelo Git e nunca deve ser
  versionada, lida em revisão ou apagada sem autorização explícita.
- A pasta `whatsapp-financas-web/@/` é uma duplicata legada criada
  acidentalmente. **Não apague nem mova essa pasta sem autorização explícita do
  responsável.**

### Banco de dados (`prisma/`)

- **SQLite** com Prisma ORM.
- Schema em `prisma/schema.prisma`; modelo atual: `Expense`.
- Migrations em `prisma/migrations/`; banco local em `prisma/dev.db` (ignorado).
- Toda mudança de schema exige migration versionada. Não altere migrations já
  aplicadas em produção sem justificativa e estratégia de rollback.
- Antes de rodar o backend em uma máquina limpa, aplique as migrations com
  `npx prisma migrate deploy`.

### Frontend (`whatsapp-financas-web/`)

- **React 19 + Vite + TypeScript**, Tailwind CSS, shadcn/ui, React Query
  (`@tanstack/react-query`), React Router e Recharts.
- Rotas declaradas em `src/App.tsx`: `/`, `/expenses`, `/reports`, `/office`.
- Organização por feature em `src/features/` (`dashboard`, `expenses`, `office`)
  e páginas em `src/pages/`.
- `src/shared/` contém layout, feedback e componentes compartilhados;
  `src/components/ui/` contém componentes base no padrão shadcn.
- `src/features/expenses/services/api.ts` usa Axios com `baseURL`
  `http://localhost:3000`.
- O frontend não possui runner de testes configurado no momento.
- O Vite pode subir em `5173` ou `5174`; o backend aceita essas origens por
  `CORS_ORIGIN`.

### Variáveis de ambiente relevantes

Documentadas em `.env.example`: `DATABASE_URL`, `OPENCODE_API_KEY`,
`OPENCODE_BASE_URL`, `OPENCODE_CLI_PATH`, `WHATSAPP_ENABLED`, `CORS_ORIGIN`,
`BOT_GROUP_ID` e `ADMIN_NUMBER`. Valores reais vivem apenas em `.env` local ou
no gerenciador de secrets do ambiente. Nunca copie `.env` para o repositório.

## 2. Regras de codificação segura

### Segredos e credenciais

- Nunca exponha, faça commit ou cole em código/issue/logs: tokens, chaves de API,
  senhas, cookies, credenciais de banco, QR Codes de sessão ou conteúdo de
  `.env`.
- `.env` e arquivos de sessão (`auth/`) são ignorados pelo Git. Não force o
  versionamento deles. Use `.env.example` apenas com placeholders.
- Use `process.env` no backend e valide a presença de variáveis obrigatórias no
  startup; falhe de forma explícita quando necessário.
- Não logue payloads completos de requisições, prompts, tokens ou dados
  financeiros sensíveis. Redija antes de logar.
- Não adicione dependências que executem código remoto, telemetria inesperada
  ou scripts de pós-instalação sem justificativa.

### Entradas, tipagem e erros

- Respeite o TypeScript do projeto: evite `any` novo, prefira tipos explícitos,
  `unknown` + narrowing e tipos de domínio compartilhados.
- DTOs do backend devem usar `class-validator`/`class-transformer` e ser
  aplicados via `ValidationPipe` global (`whitelist`, `transform`,
  `forbidNonWhitelisted`).
- Valide e normalize dados vindos de WhatsApp, query params, bodies e respostas
  de APIs externas. Não confie em formato implícito.
- Trate erros de forma explícita. Não engula exceções com `catch {}` vazio.
  Preserve o status HTTP correto e não vaze stack traces/segredos ao cliente.
- Não altere configurações globais (CORS, CSP, autenticação, headers, Swagger)
  sem justificar o impacto de segurança e testar o comportamento.
- Siga o princípio do menor privilégio em credenciais, permissões e escopos de
  API.

### Escopo e arquivos sensíveis

- Mantenha a mudança focada no pedido. Evite refatorações amplas, renomeações ou
  dependências novas sem necessidade comprovada.
- Não altere sem justificativa explícita: `auth/`, migrações já aplicadas,
  `prisma/dev.db`, `.env`, `package-lock.json` (quando não houver mudança real de
  dependências), `dist/` e arquivos gerados.
- Não edite `node_modules/`, arquivos compilados em `dist/` ou artefatos de build.
- Se precisar remover arquivos existentes, confirme antes quando eles não forem
  claramente gerados/descartáveis.

### Frontend

- Evite `dangerouslySetInnerHTML`, URLs de API hardcoded fora da configuração e
  armazenamento de tokens em `localStorage` sem avaliação de risco.
- Use React Query para dados remotos, mantenha estados de loading/erro e não
  esconda falhas de API atrás de mensagens genéricas quando o erro real puder ser
  exposto com segurança.
- Respeite acessibilidade básica (labels, foco, botões semânticos) e não quebre o
  layout responsivo existente.

## 3. Critérios de qualidade antes de concluir

Sempre que possível, execute e reporte:

| Verificação | Backend | Frontend |
| --- | --- | --- |
| Tipos | `npm run typecheck` | `npm run typecheck` (dentro de `whatsapp-financas-web`) |
| Build | `npm run build` | `npm run build` (dentro de `whatsapp-financas-web`) |
| Lint | `npm run lint:check` | `npm run lint` (dentro de `whatsapp-financas-web`) |
| Testes | `npm test -- --runInBand` | sem runner configurado |

Regras:

- Não use `--fix` automático como substituto de revisão; se rodar lint com fix,
  revise o diff resultante.
- Se um comando não puder ser executado, diga exatamente qual, por quê e qual é
  o risco residual.
- Não declare uma tarefa concluída com build/typecheck quebrados ou com novos
  erros de lint/teste introduzidos pela mudança.
- Dívida técnica já existente deve ser reportada, mas não deve ser mascarada como
  se a mudança estivesse limpa.

### Baseline conhecido (nesta configuração)

O repositório ainda tem dívida de lint fora do escopo alterado:

- `npm run lint:check` (backend completo) falha por formatação Prettier em
  arquivos legados, por uma asserção desnecessária em
  `src/whatsapp/expense-message-parser.ts` e pelo arquivo
  `test/app.e2e-spec.ts`, que está fora do `projectService` do ESLint.
- `npm run lint` do frontend falha em `src/components/ui/badge.tsx`,
  `src/components/ui/button.tsx` (regra react-refresh) e na pasta legada `@/`.
- `npm test -- --runInBand` está passando (12/12 suítes).

O gate padrão reduz o escopo para **arquivos alterados**, mas dívida antiga em um
arquivo tocado pela mudança ainda bloqueia — ela passa a fazer parte do diff
revisado. O modo `--strict` roda tudo e é o objetivo a ser atingido quando a
dívida for paga.

## 4. Escritório de Agentes (revisão antes de subir)

Papéis definidos em `.opencode/agents/`:

1. **Implementador / Arquiteto** — implementa seguindo este arquivo, mantém o
   escopo e faz a auto-revisão.
2. **Revisor de Segurança & Qualidade** (`security-reviewer`) — audita segredos,
   arquivos sensíveis, validação, tratamento de erro, edge cases, permissões,
   escopo e regressões. É somente leitura.
3. **Revisor de Testes & Build** (`build-reviewer`) — roda tipos, build, lint e
   testes no escopo alterado; não edita arquivos.

Fluxo obrigatório antes de `commit`, `push` ou abertura de PR:

```text
implementar
  → auto-revisão contra este AGENTS.md
  → security-reviewer
  → build-reviewer / bash scripts/agent-review.sh --base <ref>
  → se houver bloqueio: corrigir e repetir
  → somente então commitar/push/PR (com pedido explícito do usuário)
```

### Severidade e gate de aprovação

- **Crítico (bloqueia):** segredo exposto, arquivo sensível versionado, bypass de
  validação/autorização, injeção, perda de dados, build/typecheck quebrado ou
  falha de segurança conhecida introduzida pela mudança.
- **Alto (bloqueia):** erro não tratado em caminho relevante, ausência de teste
  para lógica de risco, regressão funcional, quebra de contrato de API, migração
  insegura ou mudança fora do escopo com risco.
- **Médio/baixo (avisa):** melhoria de legibilidade, cobertura adicional,
  refatoração opcional, dívida pré-existente não relacionada.

A mudança só é considerada pronta quando não houver bloqueios críticos ou altos
abertos. Aprovação com ressalvas só é aceitável para itens médios/baixos e deve
ser registrada no relatório final.

### Comandos de revisão

```bash
# Revisão local completa (working tree + staged + untracked)
npm run review:agents

# Revisão do que seria enviado em relação à main
bash scripts/agent-review.sh --base origin/main

# Apenas segurança (usado no CI)
bash scripts/agent-review.sh --only security --base origin/main

# Apenas tipos/build/lint/testes
bash scripts/agent-review.sh --only quality --base origin/main

# Revisão total (inclui dívida antiga; usada quando o baseline estiver limpo)
npm run review:agents:strict
```

O workflow `.github/workflows/agent-office-review.yml` executa as etapas de
segurança e qualidade em PRs e em pushes para `main`, com permissões somente de
leitura.

## 5. O que exige atenção manual

- Commits, pushes, abertura/merge de PR e alteração de configurações do GitHub
  exigem pedido explícito do usuário.
- Revisar manualmente qualquer mudança em `.env.example`, CORS, autenticação,
  WhatsApp/Baileys, cron de relatórios, migrations e dependências.
- Confirmar que `.env`, `auth/` e bancos SQLite não aparecem em `git status`.
- O frontend não tem testes automatizados: mudanças de UI/feature precisam de
  verificação manual do fluxo e do build.
- Se o gate falhar por dívida antiga, não a esconda: registre o blocker e peça
  decisão antes de ampliar o escopo.
