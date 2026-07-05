import type { Expense } from "@/features/expenses/types/expense";
import { formatCurrency } from "@/utils/format-currency";

export function getDashboardInsights(expenses: Expense[]) {
  const expenseItems = expenses.filter((item) => item.type === "expense");
  const incomeItems = expenses.filter((item) => item.type === "income");

  const totalExpenses = expenseItems.reduce(
    (acc, item) => acc + item.value,
    0,
  );

  const totalIncome = incomeItems.reduce(
    (acc, item) => acc + item.value,
    0,
  );

  const balance = totalIncome - totalExpenses;

  const byCategory = expenseItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.value;
    return acc;
  }, {});

  const topCategory = Object.entries(byCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const insights: string[] = [];

  if (expenses.length === 0) {
    return [
      "Comece registrando suas primeiras receitas e despesas para que eu consiga gerar análises financeiras.",
      "Você pode lançar dados pelo WhatsApp ou pelo formulário do dashboard.",
      "Assim que houver movimentações, eu identificarei padrões, categorias e oportunidades de economia.",
    ];
  }

  if (balance >= 0) {
    insights.push(
      `Seu saldo atual está positivo em ${formatCurrency(balance)}. Ótimo sinal de controle financeiro.`,
    );
  } else {
    insights.push(
      `Seu saldo atual está negativo em ${formatCurrency(Math.abs(balance))}. Vale revisar os maiores gastos.`,
    );
  }

  if (topCategory) {
    insights.push(
      `Sua maior categoria de despesa é ${topCategory[0]}, com ${formatCurrency(topCategory[1])} registrados.`,
    );
  }

  if (totalExpenses > totalIncome && totalIncome > 0) {
    insights.push(
      "Suas despesas estão acima das receitas. Recomendo definir um limite por categoria.",
    );
  }

  if (expenseItems.length > 0) {
    const averageExpense = totalExpenses / expenseItems.length;

    insights.push(
      `Seu gasto médio por lançamento é de ${formatCurrency(averageExpense)}.`,
    );
  }

  return insights.slice(0, 4);
}