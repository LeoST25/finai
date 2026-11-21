/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { ExpensesService } from '../expenses/expenses.service';
import {
  AgentProfile,
  AgentRole,
  AgentStatus,
  AgentTaskResult,
  OfficeLogEntry,
} from './ai.types';

const execFileAsync = promisify(execFile);

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  private agents: Record<AgentRole, AgentProfile> = {
    cfo: {
      id: 'cfo',
      name: 'Helena Vance',
      roleTitle: 'CFO & Estrategista Chefe',
      department: 'Diretoria Executiva',
      model: 'opencode-go/qwen3.7-plus',
      engine: 'opencode-go-api',
      status: 'idle',
      currentTask: 'Monitorando fluxo de caixa e saldo mensal',
      deskPosition: { x: 22, y: 28 },
      accentColor: '#6366f1',
      avatarBadge: 'HV',
      updatedAt: new Date().toISOString(),
    },
    auditor: {
      id: 'auditor',
      name: 'Marcus Sterling',
      roleTitle: 'Auditor de Gastos & Risco',
      department: 'Compliance & Auditoria',
      model: 'opencode-go/deepseek-v4.1-flash',
      engine: 'opencode-go-api',
      status: 'idle',
      currentTask: 'Analisando anomalias e gastos fora do padrão',
      deskPosition: { x: 74, y: 28 },
      accentColor: '#f59e0b',
      avatarBadge: 'MS',
      updatedAt: new Date().toISOString(),
    },
    planner: {
      id: 'planner',
      name: 'Clara Sato',
      roleTitle: 'Planejadora de Metas & Orçamento',
      department: 'Planejamento Financeiro',
      model: 'opencode-go/minimax-m3',
      engine: 'opencode-go-api',
      status: 'idle',
      currentTask: 'Projetando economia e metas de curto prazo',
      deskPosition: { x: 25, y: 72 },
      accentColor: '#10b981',
      avatarBadge: 'CS',
      updatedAt: new Date().toISOString(),
    },
    categorizer: {
      id: 'categorizer',
      name: 'Leo Bot (OpenCode)',
      roleTitle: 'Triagem WhatsApp & Classificação',
      department: 'Operações & Automação',
      model: 'opencode-go/deepseek-v4.1-flash',
      engine: 'opencode-cli',
      status: 'idle',
      currentTask: 'Aguardando novas mensagens e lançamentos',
      deskPosition: { x: 74, y: 72 },
      accentColor: '#06b6d4',
      avatarBadge: 'OC',
      updatedAt: new Date().toISOString(),
    },
  };

  private logs: OfficeLogEntry[] = [
    {
      id: 'init-1',
      agentId: 'cfo',
      agentName: 'Helena Vance',
      action: 'Escritório inicializado',
      detail: 'Conectada ao workspace FinAI via OpenCode Go.',
      timestamp: new Date().toISOString(),
      type: 'success',
    },
    {
      id: 'init-2',
      agentId: 'auditor',
      agentName: 'Marcus Sterling',
      action: 'Varredura preventiva concluída',
      detail: 'Pronto para auditar transações e alertas de teto.',
      timestamp: new Date().toISOString(),
      type: 'info',
    },
  ];

  constructor(private readonly expensesService: ExpensesService) {}

  getOfficeState() {
    const apiKeyConfigured = Boolean(process.env.OPENCODE_API_KEY);
    return {
      provider: 'OpenCode Go',
      baseUrl: process.env.OPENCODE_BASE_URL || 'https://opencode.ai/zen/go/v1',
      apiKeyConfigured,
      agents: Object.values(this.agents),
      logs: this.logs.slice(0, 30),
    };
  }

  private updateAgentStatus(
    agentId: AgentRole,
    status: AgentStatus,
    currentTask: string,
    lastOutput?: string,
  ) {
    const agent = this.agents[agentId];
    if (!agent) return;
    agent.status = status;
    agent.currentTask = currentTask;
    if (lastOutput !== undefined) {
      agent.lastOutput = lastOutput;
    }
    agent.updatedAt = new Date().toISOString();
  }

  private pushLog(entry: Omit<OfficeLogEntry, 'id' | 'timestamp'>) {
    this.logs.unshift({
      ...entry,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
    });
    if (this.logs.length > 50) {
      this.logs = this.logs.slice(0, 50);
    }
  }

  private getSystemPrompt(agentId: AgentRole): string {
    const prompts: Record<AgentRole, string> = {
      cfo: 'Você é Helena Vance, CFO do escritório FinAI. Responda em português de forma executiva, objetiva e estratégica com base nos dados financeiros reais fornecidos.',
      auditor:
        'Você é Marcus Sterling, Auditor Financeiro do FinAI. Identifique gastos supérfluos, concentrações de categoria e riscos no orçamento em português direto.',
      planner:
        'Você é Clara Sato, Planejadora Financeira do FinAI. Crie planos práticos de economia, metas e cortes inteligentes em português claro.',
      categorizer:
        'Você é Leo Bot, agente de operações OpenCode do FinAI. Classifique transações, resuma lançamentos e sugira melhorias nas regras de categorização.',
    };
    return prompts[agentId];
  }

  async runAgent(
    agentId: AgentRole,
    userPrompt: string,
    executionMode: 'api' | 'cli' = 'api',
  ): Promise<AgentTaskResult> {
    const start = Date.now();
    const agent = this.agents[agentId];

    this.updateAgentStatus(
      agentId,
      'thinking',
      `Processando: "${userPrompt.slice(0, 48)}..."`,
    );
    this.pushLog({
      agentId,
      agentName: agent.name,
      action: 'Nova tarefa recebida',
      detail: userPrompt,
      type: 'action',
    });

    const expenses = await this.expensesService.findAll();
    const recentExpenses = expenses.slice(0, 40);
    const totalIncome = expenses
      .filter((e) => e.type === 'income')
      .reduce((acc, e) => acc + e.value, 0);
    const totalExpense = expenses
      .filter((e) => e.type === 'expense')
      .reduce((acc, e) => acc + e.value, 0);

    const financialContext = JSON.stringify({
      resumoGeral: {
        totalReceitas: totalIncome,
        totalDespesas: totalExpense,
        saldo: totalIncome - totalExpense,
        totalLancamentos: expenses.length,
      },
      ultimosLancamentos: recentExpenses,
    });

    const fullPrompt = `${this.getSystemPrompt(agentId)}\n\nDados financeiros atuais do usuário:\n${financialContext}\n\nSolicitação: ${userPrompt}`;

    try {
      this.updateAgentStatus(
        agentId,
        'working',
        'Consultando modelo via OpenCode Go...',
      );

      let responseText = '';
      let modeUsed: AgentTaskResult['mode'] = 'opencode-go-api';

      if (executionMode === 'cli') {
        responseText = await this.executeViaOpenCodeCli(
          agent.model,
          fullPrompt,
        );
        modeUsed = 'opencode-cli';
      } else if (process.env.OPENCODE_API_KEY) {
        responseText = await this.executeViaOpenCodeGoApi(
          agent.model,
          fullPrompt,
        );
        modeUsed = 'opencode-go-api';
      } else {
        responseText = this.buildLocalSmartFallback(
          agentId,
          userPrompt,
          totalIncome,
          totalExpense,
          recentExpenses,
        );
        modeUsed = 'local-fallback';
      }

      this.updateAgentStatus(
        agentId,
        'done',
        'Análise concluída com sucesso',
        responseText,
      );
      this.pushLog({
        agentId,
        agentName: agent.name,
        action: `Entrega concluída (${modeUsed})`,
        detail:
          responseText.slice(0, 140) + (responseText.length > 140 ? '...' : ''),
        type: 'success',
      });

      setTimeout(() => {
        if (this.agents[agentId].status === 'done') {
          this.updateAgentStatus(
            agentId,
            'idle',
            'Aguardando próxima solicitação',
          );
        }
      }, 12000);

      return {
        agentId,
        modelUsed: agent.model,
        mode: modeUsed,
        response: responseText,
        durationMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      const fallback = this.buildLocalSmartFallback(
        agentId,
        userPrompt,
        totalIncome,
        totalExpense,
        recentExpenses,
      );
      this.logger.warn(
        `Fallback ativado para ${agentId}: ${error?.message || error}`,
      );
      this.updateAgentStatus(
        agentId,
        'idle',
        'Operando em modo contingência local',
        fallback,
      );
      this.pushLog({
        agentId,
        agentName: agent.name,
        action: 'Fallback local acionado',
        detail: `Configure OPENCODE_API_KEY ou CLI opencode para resposta remota (${error?.message || 'sem chave'}).`,
        type: 'alert',
      });

      return {
        agentId,
        modelUsed: agent.model,
        mode: 'local-fallback',
        response: fallback,
        durationMs: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async runDailyStandup() {
    const roles: AgentRole[] = ['cfo', 'auditor', 'planner'];
    const results: AgentTaskResult[] = [];
    for (const role of roles) {
      const res = await this.runAgent(
        role,
        'Faça seu parecer rápido de Daily Standup sobre a saúde financeira atual em até 3 tópicos objetivos.',
        'api',
      );
      results.push(res);
    }
    return results;
  }

  private async executeViaOpenCodeGoApi(
    modelId: string,
    prompt: string,
  ): Promise<string> {
    const baseUrl = (
      process.env.OPENCODE_BASE_URL || 'https://opencode.ai/zen/go/v1'
    ).replace(/\/$/, '');
    const apiKey = process.env.OPENCODE_API_KEY;
    const cleanModel = modelId.replace(/^opencode-go\//, '');

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: cleanModel,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`OpenCode Go HTTP ${response.status}: ${errText}`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (
      data?.choices?.[0]?.message?.content ||
      'Sem resposta retornada pelo modelo.'
    );
  }

  private async executeViaOpenCodeCli(
    modelId: string,
    prompt: string,
  ): Promise<string> {
    const cliBin = process.env.OPENCODE_CLI_PATH || 'opencode';
    const { stdout } = await execFileAsync(
      cliBin,
      ['run', '--model', modelId, prompt],
      {
        timeout: 45000,
        maxBuffer: 1024 * 1024,
      },
    );
    return stdout.trim();
  }

  private buildLocalSmartFallback(
    agentId: AgentRole,
    prompt: string,
    income: number,
    expense: number,
    items: Array<{
      description: string;
      category: string;
      value: number;
      type: string;
    }>,
  ): string {
    const balance = income - expense;
    const byCat: Record<string, number> = {};
    for (const item of items.filter((i) => i.type === 'expense')) {
      byCat[item.category] = (byCat[item.category] || 0) + item.value;
    }
    const topCat = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];

    const header = `[Modo Local Simulado — adicione OPENCODE_API_KEY no .env para conectar ao OpenCode Go]\n\n`;

    if (agentId === 'cfo') {
      return (
        header +
        `📊 **Parecer Executivo (Helena Vance)**\n` +
        `• Receitas acumuladas: R$ ${income.toFixed(2)}\n` +
        `• Despesas acumuladas: R$ ${expense.toFixed(2)}\n` +
        `• Saldo líquido atual: R$ ${balance.toFixed(2)}\n` +
        `• Diretriz: ${balance >= 0 ? 'Manter reserva de liquidez e limitar gastos variáveis em 15%.' : 'Priorizar contenção imediata de despesas não essenciais.'}`
      );
    }

    if (agentId === 'auditor') {
      return (
        header +
        `🔍 **Relatório de Auditoria (Marcus Sterling)**\n` +
        `• Total de registros auditados: ${items.length}\n` +
        `• Maior concentração de saída: ${topCat ? `${topCat[0]} (R$ ${topCat[1].toFixed(2)})` : 'Sem despesas registradas ainda'}\n` +
        `• Recomendação de compliance: Revisar lançamentos duplicados e definir teto semanal por categoria.`
      );
    }

    if (agentId === 'planner') {
      const targetSave = Math.max(expense * 0.12, 50);
      return (
        header +
        `🎯 **Plano de Ação (Clara Sato)**\n` +
        `• Meta sugerida de economia (12%): R$ ${targetSave.toFixed(2)}/mês\n` +
        `• Foco principal: Otimizar gastos na categoria "${topCat?.[0] || 'geral'}"\n` +
        `• Próximo passo para "${prompt}": Automatizar alertas diários no WhatsApp.`
      );
    }

    return (
      header +
      `🤖 **Triagem OpenCode (Leo Bot)**\n` +
      `• Lançamentos recentes analisados: ${items.length}\n` +
      `• Status do parser WhatsApp: Ativo e pronto para comandos naturais.`
    );
  }
}
