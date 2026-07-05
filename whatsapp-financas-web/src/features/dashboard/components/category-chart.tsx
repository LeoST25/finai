import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartNoAxesColumn } from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";
import { getCategorySummary } from "../category-summary";

import { EmptyState } from "@/shared/feedback/empty-state";
import { DashboardWidget } from "@/shared/ui/components/dashboard-widget";

type Props = {
  expenses: Expense[];
};

export function CategoryChart({ expenses }: Props) {
  const data = getCategorySummary(expenses);

  return (
    <DashboardWidget
      title="Despesas por categoria"
      description="Distribuição dos gastos por categoria."
    >
      <div className="h-80">
        {data.length === 0 ? (
          <EmptyState
            icon={ChartNoAxesColumn}
            title="Sem despesas para exibir"
            description="Quando você registrar despesas, o gráfico aparecerá aqui."
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `R$ ${Number(value).toFixed(2)}`,
                  "Total",
                ]}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardWidget>
  );
}