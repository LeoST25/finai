import { Cpu, Sparkles, Terminal, Wifi } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AgentProfile, AgentRole } from '../types/office';

interface OfficeFloorplanProps {
  agents: AgentProfile[];
  selectedAgentId: AgentRole;
  onSelectAgent: (id: AgentRole) => void;
}

const statusMeta: Record<
  AgentProfile['status'],
  { label: string; dotClass: string; badgeClass: string; active: boolean }
> = {
  idle: {
    label: 'Em prontidão',
    dotClass: 'bg-emerald-400',
    badgeClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    active: false,
  },
  thinking: {
    label: 'Raciocinando',
    dotClass: 'bg-amber-400 animate-ping',
    badgeClass: 'border-amber-500/40 bg-amber-500/15 text-amber-300',
    active: true,
  },
  working: {
    label: 'Executando',
    dotClass: 'bg-indigo-400 animate-ping',
    badgeClass: 'border-indigo-500/40 bg-indigo-500/20 text-indigo-200',
    active: true,
  },
  reviewing: {
    label: 'Auditando',
    dotClass: 'bg-cyan-400 animate-pulse',
    badgeClass: 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200',
    active: true,
  },
  done: {
    label: 'Concluído',
    dotClass: 'bg-emerald-400',
    badgeClass: 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200',
    active: false,
  },
  error: {
    label: 'Atenção',
    dotClass: 'bg-rose-400',
    badgeClass: 'border-rose-500/40 bg-rose-500/20 text-rose-200',
    active: false,
  },
};

export function OfficeFloorplan({
  agents,
  selectedAgentId,
  onSelectAgent,
}: OfficeFloorplanProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 p-5 text-white shadow-xl sm:p-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.35) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="pointer-events-none absolute -top-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight text-white">
                FinAI Agent Studio — Planta Operacional
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                <Wifi className="h-3 w-3" /> OpenCode Go
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clique em uma estação de trabalho para delegar análises financeiras em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-mono text-[11px] text-slate-300">
            zen/go/v1
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-5">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-800/90 bg-slate-900/60 px-4 py-2.5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>
              <strong>Hub Central SQLite + WhatsApp:</strong> todos os agentes leem seus lançamentos atualizados automaticamente.
            </span>
          </div>
          <span className="hidden font-mono text-[11px] text-slate-400 sm:inline">
            {agents.length} estações ativas
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {agents.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            const meta = statusMeta[agent.status] || statusMeta.idle;

            return (
              <button
                key={agent.id}
                type="button"
                onClick={() => onSelectAgent(agent.id)}
                className={cn(
                  'group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-200',
                  isSelected
                    ? 'border-indigo-500/70 bg-slate-900/95 shadow-lg shadow-indigo-950/50 ring-1 ring-indigo-500/40'
                    : 'border-slate-800 bg-slate-900/55 hover:border-slate-700 hover:bg-slate-900/85',
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-inner"
                      style={{
                        background: `linear-gradient(135deg, ${agent.accentColor}, #0f172a)`,
                      }}
                    >
                      {agent.avatarBadge}
                      <span
                        className={cn(
                          'absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-950',
                          meta.dotClass,
                        )}
                      />
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        {agent.department}
                      </p>
                      <h4 className="text-base font-bold text-white group-hover:text-indigo-200">
                        {agent.name}
                      </h4>
                      <p className="text-xs text-slate-400">{agent.roleTitle}</p>
                    </div>
                  </div>

                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
                      meta.badgeClass,
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {meta.label}
                  </span>
                </div>

                <div className="mt-4 rounded-xl border border-slate-800/90 bg-slate-950/90 p-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span className="inline-flex items-center gap-1 font-mono text-indigo-300">
                      <Terminal className="h-3 w-3" />
                      {agent.model}
                    </span>
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                      {agent.engine === 'opencode-cli' ? 'CLI' : 'API'}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300">
                    {agent.currentTask}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
