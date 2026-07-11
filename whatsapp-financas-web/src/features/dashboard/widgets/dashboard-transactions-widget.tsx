import type { Expense } from "@/features/expenses/types/expense";
import { LatestTransactions } from "../components/latest-transactions";

type Props = {
  expenses: Expense[];
};

export function DashboardTransactionsWidget({ expenses }: Props) {
  return <LatestTransactions expenses={expenses} />;
}