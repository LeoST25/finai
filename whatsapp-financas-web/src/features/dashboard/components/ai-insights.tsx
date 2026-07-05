import { Bot, Sparkles } from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";

import { DashboardWidget } from "@/shared/ui/components/dashboard-widget";
import { getDashboardInsights } from "../dashboard-insights";

type AiInsightsProps = {
  expenses: Expense[];
};

export function AiInsights({ expenses }: AiInsightsProps) {
  const insights = getDashboardInsights(expenses);

  return (
    <DashboardWidget
      title="Insights do FinAI"
      description="Análises automáticas baseadas nos seus lançamentos."
      action={
        <div className="rounded-full bg-violet-100 p-2">
          <Sparkles className="h-5 w-5 text-violet-600" />
        </div>
      }
      className="border-violet-200"
    >
      <div className="mb-5 flex items-center gap-3 rounded-xl bg-violet-50 p-4">
        <div className="rounded-full bg-violet-100 p-3">
          <Bot className="h-5 w-5 text-violet-600" />
        </div>

        <div>
          <p className="font-semibold text-slate-900">
            FinAI Assistant
          </p>

          <p className="text-sm text-slate-500">
            Insights gerados automaticamente.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {insights.map((insight) => (
          <div
            key={insight}
            className="rounded-xl border bg-slate-50 p-4 text-sm leading-relaxed"
          >
            {insight}
          </div>
        ))}
      </div>
    </DashboardWidget>
  );
}