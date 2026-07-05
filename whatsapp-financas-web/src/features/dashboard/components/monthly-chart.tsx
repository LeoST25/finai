import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartSpline } from "lucide-react";

import type { Expense } from "@/features/expenses/types/expense";
import { getMonthlySummary } from "../monthly-summary";

import { EmptyState } from "@/shared/feedback/empty-state";
import { DashboardWidget } from "@/shared/ui/components/dashboard-widget";

type Props = {
  expenses: Expense[];
};

export function MonthlyChart({ expenses }: Props) {
  const data = getMonthlySummary(expenses);
  const hasData = expenses.length > 0;

  return (
    <DashboardWidget
      title="Receitas vs Despesas"
      description="Comparativo mensal das movimentações."
    >
      <div className="h-80">
        {!hasData ? (
          <EmptyState
            icon={ChartSpline}
            title="Sem dados mensais"
            description="Cadastre receitas ou despesas para acompanhar a evolução mês a mês."
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                formatter={(value) => [
                  `R$ ${Number(value).toFixed(2)}`,
                  "",
                ]}
              />

              <Legend />

              <Bar
                dataKey="income"
                name="Receitas"
                radius={[8, 8, 0, 0]}
              />

              <Bar
                dataKey="expense"
                name="Despesas"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardWidget>
  );
}