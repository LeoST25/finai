import { Bot, Sparkles } from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardInsights } from "../dashboard-insights";

type AiInsightsProps = {
  expenses: Expense[];
};

export function AiInsights({ expenses }: AiInsightsProps) {
  const insights = getDashboardInsights(expenses);

  return (
    <Card className="overflow-hidden border-slate-200 bg-gradient-to-br from-slate-950 to-slate-800 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Insights do FinAI
          </CardTitle>
          <p className="mt-1 text-sm text-slate-300">
            Análises automáticas baseadas nos seus lançamentos.
          </p>
        </div>

        <div className="rounded-full bg-white/10 p-3">
          <Sparkles className="h-5 w-5 text-purple-200" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((insight) => (
            <div
              key={insight}
              className="rounded-xl border border-white/10 bg-white/10 p-4 text-sm leading-relaxed text-slate-100"
            >
              {insight}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}