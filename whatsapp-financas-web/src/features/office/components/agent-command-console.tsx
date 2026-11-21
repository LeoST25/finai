import { useState } from 'react';
import { Bot, Play, Send, Sparkles, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AgentProfile, AgentRole, AgentTaskResult } from '../types/office';

interface AgentCommandConsoleProps {
  agent: AgentProfile;
  isRunning: boolean;
  lastResult: AgentTaskResult | null;
  onExecute: (prompt: string, mode: 'api' | 'cli') => void;
}

const quickPromptsByRole: Record<AgentRole, string[]> = {
  cfo: [
    'Faça um diagnóstico executivo do meu saldo atual e taxa de economia.',
    'Onde estou perdendo mais margem financeira este mês?',
  ],
  auditor: [
    'Audite meus lançamentos recentes e aponte gastos fora do padrão.',
    'Quais categorias concentram mais de 60% das minhas despesas?',
  ],
  planner: [
    'Monte um plano prático para economizar 15% nos próximos 30 dias.',
    'Sugira tetos semanais para alimentação, mercado e transporte.',
  ],
  categorizer: [
    'Revise meus últimos lançamentos e sugira melhorias de categorização.',
    'Gere um resumo pronto para eu enviar no WhatsApp.',
  ],
};

export function AgentCommandConsole({
  agent,
  isRunning,
  lastResult,
  onExecute,
}: AgentCommandConsoleProps) {
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'api' | 'cli'>(
    agent.engine === 'opencode-cli' ? 'cli' : 'api',
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isRunning) return;
    onExecute(prompt.trim(), mode);
    setPrompt('');
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold text-white"
              style={{ backgroundColor: agent.accentColor }}
            >
              {agent.avatarBadge}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Console de Delegação — {agent.name}
              </h3>
              <p className="text-xs text-slate-500">
                Modelo ativo: <span className="font-mono text-slate-700">{agent.model}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl border bg-slate-50 p-1 text-xs">
            <button
              type="button"
              onClick={() => setMode('api')}
              className={`rounded-lg px-2.5 py-1 font-medium transition ${
                mode === 'api'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              OpenCode Go API
            </button>
            <button
              type="button"
              onClick={() => setMode('cli')}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium transition ${
                mode === 'cli'
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Terminal className="h-3 w-3" />
              CLI Local
            </button>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs font-medium text-slate-500">Comandos rápidos:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {quickPromptsByRole[agent.id].map((item) => (
              <button
                key={item}
                type="button"
                disabled={isRunning}
                onClick={() => onExecute(item, mode)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-left text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 disabled:opacity-50"
              >
                <Play className="h-3 w-3 shrink-0 text-indigo-600" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-700">
              <Bot className="h-4 w-4 text-indigo-600" />
              Parecer do Agente
            </span>
            {lastResult && lastResult.agentId === agent.id && (
              <span className="font-mono text-[11px] text-slate-400">
                {lastResult.mode} • {lastResult.durationMs}ms
              </span>
            )}
          </div>

          <div className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {isRunning ? (
              <div className="flex items-center gap-2 py-6 text-indigo-600">
                <Sparkles className="h-4 w-4 animate-spin" />
                <span>{agent.name} está analisando seus dados financeiros via OpenCode Go...</span>
              </div>
            ) : lastResult && lastResult.agentId === agent.id ? (
              lastResult.response
            ) : agent.lastOutput ? (
              agent.lastOutput
            ) : (
              <p className="py-4 text-xs text-slate-400">
                Selecione um comando rápido acima ou envie uma instrução personalizada abaixo para acionar este agente.
              </p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={`Pergunte algo para ${agent.name}...`}
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none"
        />
        <Button
          type="submit"
          disabled={isRunning || !prompt.trim()}
          className="rounded-xl bg-slate-950 px-4 text-white hover:bg-slate-800"
        >
          <Send className="mr-1.5 h-4 w-4" />
          Enviar
        </Button>
      </form>
    </div>
  );
}
