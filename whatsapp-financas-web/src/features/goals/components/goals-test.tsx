import { useGoals } from "@/features/goals/hooks";

export function GoalsTest() {
  const {
    goals,
    savingsGoals,
    categoryLimitGoals,
    exceededGoals,
    almostCompleteGoals,
    updateGoalCurrentAmount,
    resetGoals,
  } = useGoals();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Teste de metas</h1>

        <p>Total de metas: {goals.length}</p>
        <p>Metas de economia: {savingsGoals.length}</p>
        <p>Limites por categoria: {categoryLimitGoals.length}</p>
        <p>Metas excedidas: {exceededGoals.length}</p>
        <p>Metas próximas do limite: {almostCompleteGoals.length}</p>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="rounded-lg border p-4"
          >
            <h2 className="font-semibold">{goal.title}</h2>

            <p>Tipo: {goal.type}</p>
            <p>Atual: R$ {goal.currentAmount.toFixed(2)}</p>
            <p>Meta: R$ {goal.targetAmount.toFixed(2)}</p>
            <p>Progresso: {goal.progress.percentage}%</p>
            <p>Restante: R$ {goal.progress.remainingAmount.toFixed(2)}</p>
            <p>Status: {goal.progress.status}</p>

            {goal.progress.daysRemaining !== undefined && (
              <p>Dias restantes: {goal.progress.daysRemaining}</p>
            )}

            <button
              type="button"
              className="mt-3 rounded bg-primary px-4 py-2 text-primary-foreground"
              onClick={() =>
                updateGoalCurrentAmount(
                  goal.id,
                  goal.currentAmount + 100,
                )
              }
            >
              Adicionar R$ 100
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="rounded border px-4 py-2"
        onClick={resetGoals}
      >
        Restaurar metas
      </button>
    </div>
  );
}