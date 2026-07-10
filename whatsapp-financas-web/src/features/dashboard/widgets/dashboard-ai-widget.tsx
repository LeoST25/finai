import type { FinancialAnalysis } from "@/features/dashboard/ai/financial-analyzer";

type DashboardAiWidgetProps = {
  analysis: FinancialAnalysis;
};

const insightStyle = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-red-200 bg-red-50 text-red-700",
  info: "border-blue-200 bg-blue-50 text-blue-700",
};

export function DashboardAiWidget({ analysis }: DashboardAiWidgetProps) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-500">
          Inteligência Financeira
        </p>

        <h2 className="text-2xl font-bold tracking-tight">
          Score {analysis.score}/100
        </h2>

        <p className="text-sm text-slate-500">
          Análise automática baseada nos seus lançamentos financeiros.
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {analysis.insights.map((insight) => (
          <div
            key={`${insight.title}-${insight.description}`}
            className={`rounded-2xl border p-4 ${
              insightStyle[insight.type]
            }`}
          >
            <h3 className="text-sm font-semibold">{insight.title}</h3>
            <p className="mt-1 text-sm opacity-90">{insight.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}