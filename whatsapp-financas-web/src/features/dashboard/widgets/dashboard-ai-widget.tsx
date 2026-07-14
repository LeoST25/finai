import { formatCurrency } from '@/features/dashboard/ai/financial-formatters';
import type { FinancialAnalysis } from '@/features/dashboard/ai/financial-analyzer';
import { groupRecommendationsByPriority } from '@/features/dashboard/ai/financial-recommendations';

type DashboardAiWidgetProps = {
  analysis: FinancialAnalysis;
};

const insightStyle = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
};

function getScoreLabel(score: number) {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Saudável';
  if (score >= 40) return 'Atenção';
  return 'Crítico';
}

export function DashboardAiWidget({ analysis }: DashboardAiWidgetProps) {
  const scoreLabel = getScoreLabel(analysis.score);
  const groupedRecommendations = groupRecommendationsByPriority(
    analysis.recommendations,
  );

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm sm:rounded-3xl">
      <div className="bg-slate-950 p-5 text-white sm:p-6">
        <p className="text-sm font-medium text-slate-300">🤖 FinAI Assistant</p>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Score financeiro
            </h2>

            <p className="mt-1 text-sm text-slate-300">
              Estou acompanhando seu mês e te digo o que merece atenção agora.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-sm text-slate-300">{scoreLabel}</p>
            <p className="text-4xl font-bold tracking-tight">
              {analysis.score}
              <span className="text-lg text-slate-300">/100</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Contexto financeiro em tempo real
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Saldo atual
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatCurrency(analysis.balance)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Receita
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatCurrency(analysis.income)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Despesas
                </p>
                <p className="mt-1 font-semibold text-slate-900">
                  {formatCurrency(analysis.totalExpenses)}
                </p>
              </div>
            </div>
          </div>

          <h3 className="mt-5 text-sm font-semibold text-slate-900">
            Insights automáticos
          </h3>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {analysis.insights.map((insight) => (
              <div
                key={`${insight.title}-${insight.description}`}
                className={`rounded-2xl border p-4 ${
                  insightStyle[insight.type]
                }`}
              >
                <h4 className="text-sm font-semibold">{insight.title}</h4>
                <p className="mt-1 text-sm opacity-90">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border bg-slate-50 p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Recomendações para você
          </h3>

          <div className="mt-3 grid gap-4">
            {[
              {
                key: 'high',
                title: 'Ação urgente',
                description: 'O que merece atenção agora.',
                items: groupedRecommendations.high,
              },
              {
                key: 'medium',
                title: 'Planejar melhor',
                description: 'Itens importantes para melhorar o mês.',
                items: groupedRecommendations.medium,
              },
              {
                key: 'low',
                title: 'Manter o ritmo',
                description: 'Pequenos ajustes para continuar bem.',
                items: groupedRecommendations.low,
              },
            ].map((group) => (
              <div
                key={group.key}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {group.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {group.description}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {group.items.length}
                  </span>
                </div>

                <div className="mt-3 grid gap-3">
                  {group.items.map((recommendation) => (
                    <div
                      key={`${recommendation.title}-${recommendation.description}`}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {recommendation.title}
                      </p>

                      <p className="mt-1 text-sm text-slate-600">
                        {recommendation.description}
                      </p>

                      {recommendation.estimatedImpact && (
                        <p className="mt-2 text-sm font-medium text-slate-700">
                          {recommendation.estimatedImpact}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
