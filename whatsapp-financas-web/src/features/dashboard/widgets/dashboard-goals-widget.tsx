import { AlertTriangle, Plus, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  GoalAlertCard,
  GoalCard,
} from "@/features/goals/components";
import type { FinancialGoalWithProgress } from "@/features/goals/hooks";
import type { GoalAlert } from "@/features/goals/types";
import { CreateGoalDialog } from '@/features/goals/components';

type DashboardGoalsWidgetProps = {
  goals: FinancialGoalWithProgress[];
  alerts: GoalAlert[];
  isLoading?: boolean;
};

const MAX_VISIBLE_GOALS = 4;
const MAX_VISIBLE_ALERTS = 2;

const alertPriority: Record<GoalAlert["type"], number> = 
{ 
  danger: 0, 
  warning: 1, 
  info: 2, 
  success: 3, }; 
  
  function sortAlertsByPriority(alerts: GoalAlert[]) 
  { return [...alerts].sort( 
    (firstAlert, secondAlert) => 
      alertPriority[firstAlert.type] - 
    alertPriority[secondAlert.type], 
  ); 
}

function DashboardGoalsWidgetSkeleton() {
  return (
    <section className="space-y-5">
      <div className="space-y-2">
        <div className="h-6 w-44 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-100" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-48 animate-pulse rounded-2xl border bg-slate-100"
          />
        ))}
      </div>
    </section>
  );
}

function DashboardGoalsEmptyState() {
  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="flex min-h-56 flex-col items-center justify-center text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
          <Target className="size-6 text-slate-500" />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-900">
          Nenhuma meta financeira
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Crie uma meta para acompanhar seu progresso, controlar limites por
          categoria e receber recomendações personalizadas do FinAI.
        </p>

        <CreateGoalDialog
          trigger={
            <Button className="mt-5">
              <Plus className="size-4" />
              Criar primeira meta
            </Button>
          }
        />
      </div>
    </section>
  );
}

export function DashboardGoalsWidget({
  goals,
  alerts,
  isLoading = false,
}: DashboardGoalsWidgetProps) {
  if (isLoading) {
    return <DashboardGoalsWidgetSkeleton />;
  }

  if (goals.length === 0) {
    return <DashboardGoalsEmptyState />;
  }

  const visibleGoals = goals.slice(0, MAX_VISIBLE_GOALS);

  const visibleAlerts = sortAlertsByPriority(alerts).slice(
    0,
    MAX_VISIBLE_ALERTS,
  );

  const hiddenGoalsCount = Math.max(
    goals.length - visibleGoals.length,
    0,
  );

  const hiddenAlertsCount = Math.max(
    alerts.length - visibleAlerts.length,
    0,
  );

  return (
    <section className="space-y-5" aria-labelledby="dashboard-goals-title">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2
              id="dashboard-goals-title"
              className="text-xl font-semibold text-slate-900"
            >
              Metas financeiras
            </h2>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {goals.length} {goals.length === 1 ? 'meta' : 'metas'}
            </span>
          </div>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            Acompanhe o progresso das suas metas e limites por categoria.
          </p>
        </div>

        <CreateGoalDialog
          trigger={
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Nova meta
            </Button>
          }
        />
      </header>

      {visibleAlerts.length > 0 && (
        <div
          className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5"
          aria-labelledby="dashboard-goal-alerts-title"
        >
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="size-4 text-amber-700" />
            </div>

            <div>
              <h3
                id="dashboard-goal-alerts-title"
                className="font-semibold text-slate-900"
              >
                Alertas financeiros
              </h3>

              <p className="text-sm leading-6 text-slate-600">
                Pontos que precisam da sua atenção.
              </p>
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {visibleAlerts.map((alert) => (
              <GoalAlertCard key={alert.id} alert={alert} />
            ))}
          </div>

          {hiddenAlertsCount > 0 && (
            <p className="text-xs font-medium text-amber-800">
              Mais {hiddenAlertsCount}{' '}
              {hiddenAlertsCount === 1
                ? 'alerta disponível'
                : 'alertas disponíveis'}
              .
            </p>
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {visibleGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {hiddenGoalsCount > 0 && (
        <p className="text-center text-sm text-slate-500">
          Mais {hiddenGoalsCount}{' '}
          {hiddenGoalsCount === 1 ? 'meta não exibida' : 'metas não exibidas'}{' '}
          no resumo do dashboard.
        </p>
      )}
    </section>
  );
}
