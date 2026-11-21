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
import { formatCurrency } from "@/utils/format-currency";

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
      <div className="h-72 overflow-x-auto sm:h-80">
        {!hasData ? (
          <EmptyState
            icon={ChartSpline}
            title="Sem dados mensais"
            description="Cadastre receitas ou despesas para acompanhar a evolução financeira mês a mês."
          />
        ) : (
          <div className="h-full min-w-[560px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 12,
                  right: 8,
                  left: 8,
                  bottom: 8,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  fontSize={12}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  width={80}
                  tickFormatter={(value) => formatCurrency(Number(value))}
                />

                <Tooltip
                  cursor={{ fill: "rgba(15, 23, 42, 0.06)" }}
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === "income" ? "Receitas" : "Despesas",
                  ]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />

                <Legend />

                <Bar
                  dataKey="income"
                  name="Receitas"
                  fill="#16a34a"
                  radius={[10, 10, 0, 0]}
                />

                <Bar
                  dataKey="expense"
                  name="Despesas"
                  fill="#dc2626"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </DashboardWidget>
  );
}