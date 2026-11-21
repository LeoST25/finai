import type { Expense } from "@/features/expenses/types/expense";

import { CategoryChart } from "../components/category-chart";
import { MonthlyChart } from "../components/monthly-chart";

type Props = {
  expenses: Expense[];
};

export function DashboardChartsWidget({ expenses }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CategoryChart expenses={expenses} />
      <MonthlyChart expenses={expenses} />
    </div>
  );
}