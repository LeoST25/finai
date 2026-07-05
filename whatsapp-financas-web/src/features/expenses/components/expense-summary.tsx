import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  Receipt,
} from "lucide-react";

import type { ExpensesSummary as ExpensesSummaryType } from "@/features/expenses/utils/expense-summary";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format-currency";
import { cn } from "@/lib/utils";

type ExpensesSummaryProps = {
  summary: ExpensesSummaryType;
};

const cards = {
  income: {
    title: "Receitas",
    icon: ArrowUpCircle,
    className: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  expense: {
    title: "Despesas",
    icon: ArrowDownCircle,
    className: "border-red-100 bg-red-50 text-red-700",
  },
  balance: {
    title: "Saldo filtrado",
    icon: Landmark,
  },
  transactions: {
    title: "Lançamentos",
    icon: Receipt,
    className: "border-slate-100 bg-slate-50 text-slate-700",
  },
};

export function ExpensesSummary({ summary }: ExpensesSummaryProps) {
  const BalanceIcon = cards.balance.icon;
  const balanceClassName =
    summary.balance >= 0
      ? "border-emerald-100 bg-emerald-50 text-emerald-700"
      : "border-red-100 bg-red-50 text-red-700";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className={cn("border", cards.income.className)}>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium opacity-80">
              {cards.income.title}
            </p>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(summary.income)}
            </p>
          </div>

          <cards.income.icon className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className={cn("border", cards.expense.className)}>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium opacity-80">
              {cards.expense.title}
            </p>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(summary.expense)}
            </p>
          </div>

          <cards.expense.icon className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className={cn("border", balanceClassName)}>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium opacity-80">
              {cards.balance.title}
            </p>
            <p className="mt-2 text-2xl font-bold">
              {formatCurrency(summary.balance)}
            </p>
          </div>

          <BalanceIcon className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className={cn("border", cards.transactions.className)}>
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium opacity-80">
              {cards.transactions.title}
            </p>
            <p className="mt-2 text-2xl font-bold">
              {summary.transactions}
            </p>
          </div>

          <cards.transactions.icon className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>
    </div>
  );
}