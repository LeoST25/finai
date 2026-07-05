import type { Expense } from "@/features/expenses/types/expense";

export function getCategorySummary(expenses: Expense[]) {
  const onlyExpenses = expenses.filter((item) => item.type === "expense");

  const grouped = onlyExpenses.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.value;
    return acc;
  }, {});

  return Object.entries(grouped)
    .map(([category, total]) => ({
      category,
      total,
    }))
    .sort((a, b) => b.total - a.total);
}