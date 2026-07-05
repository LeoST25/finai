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

export function MonthlyChart({ expenses }: Props) {
  const data = getMonthlySummary(expenses);
  const hasData = expenses.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs despesas por mês</CardTitle>
      </CardHeader>

      <CardContent>
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
                <Bar dataKey="income" name="Receitas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expense" name="Despesas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}