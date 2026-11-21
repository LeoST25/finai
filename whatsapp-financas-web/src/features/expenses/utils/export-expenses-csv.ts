import type { Expense } from "@/features/expenses/types/expense";

function escapeCsvValue(value: string | number) {
  const stringValue = String(value).replace(/"/g, '""');

  return `"${stringValue}"`;
}

function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function formatValue(value: number) {
  return value.toFixed(2).replace(".", ",");
}

function getFileName() {
  const date = new Date().toISOString().slice(0, 10);

  return `lancamentos-${date}.csv`;
}

export function exportExpensesCsv(expenses: Expense[]) {
  const headers = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];

  const rows = expenses.map((expense) => [
    formatDate(expense.createdAt),
    expense.description,
    expense.category,
    expense.type === "income" ? "Receita" : "Despesa",
    formatValue(expense.value),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(";"))
    .join("\n");

  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = getFileName();
  link.click();

  URL.revokeObjectURL(url);
}