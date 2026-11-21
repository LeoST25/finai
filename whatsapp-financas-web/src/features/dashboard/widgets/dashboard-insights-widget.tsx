import type { Expense } from "@/features/expenses/types/expense";
import { AiInsights } from "../components/ai-insights";

type Props = {
  expenses: Expense[];
};

export function DashboardInsightsWidget({ expenses }: Props) {
  return <AiInsights expenses={expenses} />;
}