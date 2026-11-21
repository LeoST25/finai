import { useMemo, useState } from "react";
import { Bot, Loader2, Users } from "lucide-react";

import { AppLayout } from "@/shared/layout/AppLayout";
import { ErrorState } from "@/shared/feedback/error-state";
import { Button } from "@/components/ui/button";

import { AgentCommandConsole } from "@/features/office/components/agent-command-console";
import { OfficeActivityFeed } from "@/features/office/components/office-activity-feed";
import { OfficeFloorplan } from "@/features/office/components/office-floorplan";
import {
  useOfficeState,
  useRunAgent,
  useRunStandup,
} from "@/features/office/hooks/use-office";
import type { AgentProfile, AgentRole } from "@/features/office/types/office";

const EMPTY_AGENTS: AgentProfile[] = [];

export function AgentsOffice() {
  const { data, isLoading, error } = useOfficeState();
  const runAgent = useRunAgent();
  const runStandup = useRunStandup();

  const [selectedAgentId, setSelectedAgentId] = useState<AgentRole>("cfo");

  const agents = data?.agents ?? EMPTY_AGENTS;
  const logs = data?.logs ?? [];

  const selectedAgent = useMemo(() => {
    return (
      agents.find((agent) => agent.id === selectedAgentId) ?? agents[0] ?? null
    );
  }, [agents, selectedAgentId]);

  const handleExecute = (prompt: string, mode: "api" | "cli") => {
    if (!selectedAgent) return;

    runAgent.mutate({
      agentId: selectedAgent.id,
      prompt,
      executionMode: mode,
    });
  };

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-7xl space-y-4 sm:space-y-6">
        <section className="flex flex-col gap-5 rounded-2xl border bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Escritório de Agentes
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
                  Delegue análises financeiras para os agentes de IA e acompanhe
                  o trabalho em tempo real.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {data && (
              <span className="rounded-xl border bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-600">
                {data.provider}
              </span>
            )}

            <Button
              type="button"
              onClick={() => runStandup.mutate()}
              disabled={runStandup.isPending}
              className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"
            >
              {runStandup.isPending ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Users className="mr-1.5 h-4 w-4" />
              )}
              Daily Standup
            </Button>
          </div>
        </section>

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center rounded-3xl border bg-white text-sm text-slate-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Carregando escritório de agentes...
          </div>
        ) : error ? (
          <ErrorState
            title="Não foi possível carregar o escritório"
            description="Verifique se a API está rodando e tente novamente."
          />
        ) : !selectedAgent ? (
          <div className="rounded-3xl border bg-white p-6 text-sm text-slate-500">
            Nenhum agente disponível no momento.
          </div>
        ) : (
          <>
            <OfficeFloorplan
              agents={agents}
              selectedAgentId={selectedAgent.id}
              onSelectAgent={setSelectedAgentId}
            />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
              <AgentCommandConsole
                agent={selectedAgent}
                isRunning={runAgent.isPending}
                lastResult={runAgent.data ?? null}
                onExecute={handleExecute}
              />

              <OfficeActivityFeed logs={logs} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
