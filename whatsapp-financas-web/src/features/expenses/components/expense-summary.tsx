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

export function ExpensesSummary({ summary }: ExpensesSummaryProps) {
  const cards = [
    {
      title: "Receitas",
      value: formatCurrency(summary.income),
      icon: ArrowUpCircle,
      className: "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    {
      title: "Despesas",
      value: formatCurrency(summary.expense),
      icon: ArrowDownCircle,
      className: "border-red-100 bg-red-50 text-red-700",
    },
    {
      title: "Saldo filtrado",
      value: formatCurrency(summary.balance),
      icon: Landmark,
      className:
        summary.balance >= 0
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-red-100 bg-red-50 text-red-700",
    },
    {
      title: "Lançamentos",
      value: String(summary.transactions),
      icon: Receipt,
      className: "border-slate-100 bg-slate-50 text-slate-700",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className={cn("border", card.className)}>
            <CardContent className="flex items-center justify-between gap-4 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="text-sm font-medium opacity-80">
                  {card.title}
                </p>

                <p className="mt-2 truncate text-xl font-bold sm:text-2xl">
                  {card.value}
                </p>
              </div>

              <Icon className="h-7 w-7 shrink-0 opacity-80 sm:h-8 sm:w-8" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}