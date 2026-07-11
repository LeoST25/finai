import type { FinancialGoalWithProgress } from "@/features/goals/hooks";

type GoalCardProps = {
  goal: FinancialGoalWithProgress;
};

function getStatusLabel(status: FinancialGoalWithProgress["progress"]["status"]) {
  const labels = {
    "not-started": "Não iniciada",
    "in-progress": "Em andamento",
    "almost-complete": "Próxima do limite",
    completed: "Concluída",
    exceeded: "Limite ultrapassado",
  };

  return labels[status];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function GoalCard({ goal }: GoalCardProps) {
  const progressPercentage = Math.min(goal.progress.percentage, 100);

  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {goal.type === "savings"
              ? "Meta de economia"
              : "Limite por categoria"}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {goal.title}
          </h3>

          {goal.category && (
            <p className="mt-1 text-sm text-slate-500">{goal.category}</p>
          )}
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {getStatusLabel(goal.progress.status)}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-500">Progresso</span>

          <strong className="text-slate-900">
            {goal.progress.percentage}%
          </strong>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-slate-900 transition-all"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Atual
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {formatCurrency(goal.currentAmount)}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Objetivo
          </p>

          <p className="mt-1 font-semibold text-slate-900">
            {formatCurrency(goal.targetAmount)}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        {goal.progress.status === "exceeded" ? (
          <p className="text-sm font-medium text-red-600">
            Limite ultrapassado em{" "}
            {formatCurrency(goal.currentAmount - goal.targetAmount)}
          </p>
        ) : goal.progress.status === "completed" ? (
          <p className="text-sm font-medium text-emerald-600">
            Meta atingida com sucesso.
          </p>
        ) : (
          <p className="text-sm text-slate-600">
            Faltam{" "}
            <strong>{formatCurrency(goal.progress.remainingAmount)}</strong>{" "}
            para atingir o objetivo.
          </p>
        )}

        {goal.progress.daysRemaining !== undefined && (
          <p className="mt-2 text-sm text-slate-500">
            {goal.progress.daysRemaining === 0
              ? "Prazo encerrado."
              : `${goal.progress.daysRemaining} dias restantes.`}
          </p>
        )}
      </div>
    </article>
  );
}