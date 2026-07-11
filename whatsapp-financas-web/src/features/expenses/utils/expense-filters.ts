import type { Expense } from "@/features/expenses/types/expense";

export type ExpenseFilterType = "all" | "income" | "expense";

export type ExpensePeriodFilter =
  | "all"
  | "today"
  | "last7days"
  | "last30days"
  | "currentMonth";

type FilterExpensesParams = {
  search: string;
  type: ExpenseFilterType;
  category: string;
  period: ExpensePeriodFilter;
};

function startOfDay(date: Date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

function isExpenseInPeriod(expense: Expense, period: ExpensePeriodFilter) {
  if (period === "all") return true;

  const expenseDate = new Date(expense.createdAt);
  const today = startOfDay(new Date());

  if (period === "today") {
    return startOfDay(expenseDate).getTime() === today.getTime();
  }

  if (period === "last7days") {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);

    return expenseDate >= startDate;
  }

  if (period === "last30days") {
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 29);

    return expenseDate >= startDate;
  }

  if (period === "currentMonth") {
    return (
      expenseDate.getMonth() === today.getMonth() &&
      expenseDate.getFullYear() === today.getFullYear()
    );
  }

  return true;
}

export function filterExpenses(
  expenses: Expense[],
  filters: FilterExpensesParams,
) {
  const normalizedSearch = filters.search.trim().toLowerCase();

  return expenses.filter((expense) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      expense.description.toLowerCase().includes(normalizedSearch) ||
      expense.category.toLowerCase().includes(normalizedSearch);

    const matchesType =
      filters.type === "all" || expense.type === filters.type;

    const matchesCategory =
      filters.category === "all" || expense.category === filters.category;

    const matchesPeriod = isExpenseInPeriod(expense, filters.period);

    return matchesSearch && matchesType && matchesCategory && matchesPeriod;
  });
}

export function getExpenseCategories(expenses: Expense[]) {
  return Array.from(new Set(expenses.map((expense) => expense.category))).sort(
    (a, b) => a.localeCompare(b),
  );
}