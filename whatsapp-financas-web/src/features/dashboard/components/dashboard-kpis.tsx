import { ArrowDownCircle, ArrowUpCircle, Landmark, Receipt } from "lucide-react";

import { KpiCard } from "./kpi-card";
import { formatCurrency } from "@/utils/format-currency";

type DashboardKpisProps = {
  summary: {
    income: number;
    expense: number;
    balance: number;
    transactions: number;
  };
};

export function DashboardKpis({ summary }: DashboardKpisProps) {
  const savings = summary.income - summary.expense;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Saldo atual"
        value={formatCurrency(summary.balance)}
        description="Receitas menos despesas"
        icon={Landmark}
        variant={summary.balance >= 0 ? "success" : "danger"}
      />

      <KpiCard
        title="Receitas"
        value={formatCurrency(summary.income)}
        description="Total de entradas registradas"
        icon={ArrowUpCircle}
        variant="success"
      />

      <KpiCard
        title="Despesas"
        value={formatCurrency(summary.expense)}
        description="Total de saídas registradas"
        icon={ArrowDownCircle}
        variant="danger"
      />

      <KpiCard
        title="Economia"
        value={formatCurrency(savings)}
        description="Resultado financeiro acumulado"
        icon={Receipt}
        variant={savings >= 0 ? "success" : "warning"}
      />
    </div>
  );
}