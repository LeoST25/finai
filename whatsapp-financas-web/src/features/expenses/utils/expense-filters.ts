import type { Expense } from "@/features/expenses/types/expense";

export function filterExpenses(
  expenses: Expense[],
  filters: {
    search: string;
    type: string;
    category: string;
  },
) {
  return expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      expense.category.toLowerCase().includes(filters.search.toLowerCase());

    const matchesType =
      filters.type === "all" || expense.type === filters.type;

    const matchesCategory =
      filters.category === "all" || expense.category === filters.category;

    return matchesSearch && matchesType && matchesCategory;
  });
}

export function getExpenseCategories(expenses: Expense[]) {
  return Array.from(new Set(expenses.map((expense) => expense.category)));
}