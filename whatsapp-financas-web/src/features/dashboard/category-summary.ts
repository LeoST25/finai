import type { Expense } from "@/features/expenses/types/expense";

export type CategorySummaryItem = {
  category: string;
  total: number;
  count: number;
  percentage: number;
};

export function getCategorySummary(expenses: Expense[]): CategorySummaryItem[] {
  const onlyExpenses = expenses.filter((item) => item.type === "expense");

  const totalExpenses = onlyExpenses.reduce(
    (total, item) => total + item.value,
    0,
  );

  const grouped = onlyExpenses.reduce<Record<string, CategorySummaryItem>>(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          category: item.category,
          total: 0,
          count: 0,
          percentage: 0,
        };
      }

      acc[item.category].total += item.value;
      acc[item.category].count += 1;

      return acc;
    },
    {},
  );

  return Object.values(grouped)
    .map((item) => ({
      ...item,
      percentage:
        totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0,
    }))
    .sort((a, b) => b.total - a.total);
}