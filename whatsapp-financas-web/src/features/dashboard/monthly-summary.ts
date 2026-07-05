import type { Expense } from "@/features/expenses/types/expense";

const monthLabels = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

export function getMonthlySummary(expenses: Expense[]) {
  const currentYear = new Date().getFullYear();

  const months = monthLabels.map((month) => ({
    month,
    income: 0,
    expense: 0,
  }));

  expenses.forEach((item) => {
    const date = new Date(item.createdAt);

    if (date.getFullYear() !== currentYear) return;

    const monthIndex = date.getMonth();

    if (item.type === "income") {
      months[monthIndex].income += item.value;
    }

    if (item.type === "expense") {
      months[monthIndex].expense += item.value;
    }
  });

  return months;
}