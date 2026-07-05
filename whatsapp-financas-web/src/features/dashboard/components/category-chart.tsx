import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { formatCurrency } from "@/utils/format-currency";

type Props = {
  expenses: Expense[];
};

const categoryColors = [
  "#0f172a",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#16a34a",
  "#0891b2",
  "#ca8a04",
];

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
            description="Registre despesas para visualizar quais categorias mais impactam seu orçamento."
          />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 12,
                right: 8,
                left: 8,
                bottom: 24,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                fontSize={12}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                tickFormatter={(value) => formatCurrency(Number(value))}
              />

              <Tooltip
                cursor={{ fill: "rgba(15, 23, 42, 0.06)" }}
                formatter={(value, name, item) => [
                  formatCurrency(Number(value)),
                  `${item.payload.percentage.toFixed(1)}% do total`,
                ]}
                labelFormatter={(label) => `Categoria: ${label}`}
              />

              <Bar dataKey="total" name="Total" radius={[10, 10, 0, 0]}>
                {data.map((item, index) => (
                  <Cell
                    key={item.category}
                    fill={categoryColors[index % categoryColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </DashboardWidget>
  );
}