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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";

type Props = {
  expenses: Expense[];
};

export function CategoryChart({ expenses }: Props) {
  const data = getCategorySummary(expenses);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Despesas por categoria</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          {data.length === 0 ? (
            <EmptyState
              icon={ChartNoAxesColumn}
              title="Sem despesas para exibir"
              description="Quando você registrar despesas, o gráfico por categoria aparecerá aqui."
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
      </CardContent>
    </Card>
  );
}