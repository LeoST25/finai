import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/features/expenses/services/expenses.service";
import type { Expense } from "@/features/expenses/types/expense";

export function useExpenses() {
  return useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });
}