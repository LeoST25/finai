import type { Expense } from "@/features/expenses/types/expense";

type FinancialInsightType = "success" | "warning" | "danger" | "info";

export type FinancialInsight = {
  title: string;
  description: string;
  type: FinancialInsightType;
};

export type FinancialAnalysis = {
  score: number;
  balance: number;
  income: number;
  expenses: number;
  savingsRate: number;
  insights: FinancialInsight[];
};

function getAmount(expense: Expense) {
  return Number(expense.value ?? 0);
}

function isIncome(expense: Expense) {
  return expense.type === "income";
}

function isExpense(expense: Expense) {
  return expense.type === "expense";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function analyzeFinancialData(expenses: Expense[]): FinancialAnalysis {
  const income = expenses
    .filter(isIncome)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const totalExpenses = expenses
    .filter(isExpense)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const balance = income - totalExpenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  let score = 50;

  if (balance > 0) score += 20;
  if (savingsRate >= 10) score += 10;
  if (savingsRate >= 20) score += 10;
  if (totalExpenses > income) score -= 25;
  if (income === 0 && totalExpenses > 0) score -= 20;

  score = Math.max(0, Math.min(100, score));

  const insights: FinancialInsight[] = [];

  if (balance > 0) {
    insights.push({
      type: "success",
      title: "Saldo positivo",
      description: `Você está com saldo positivo de ${formatCurrency(balance)}.`,
    });
  }

  if (balance < 0) {
    insights.push({
      type: "danger",
      title: "Saldo negativo",
      description: `Suas despesas ultrapassaram suas receitas em ${formatCurrency(
        Math.abs(balance),
      )}.`,
    });
  }

  if (savingsRate >= 20) {
    insights.push({
      type: "success",
      title: "Boa taxa de economia",
      description: `Você está economizando aproximadamente ${savingsRate.toFixed(
        1,
      )}% da sua renda.`,
    });
  }

  if (income > 0 && savingsRate < 10 && balance > 0) {
    insights.push({
      type: "warning",
      title: "Economia baixa",
      description:
        "Você está fechando positivo, mas sua taxa de economia ainda está baixa.",
    });
  }

  if (totalExpenses > income && income > 0) {
    insights.push({
      type: "danger",
      title: "Despesas acima da renda",
      description:
        "Suas despesas estão maiores que suas receitas. Revise os gastos variáveis.",
    });
  }

  const expensesByCategory = expenses.filter(isExpense).reduce(
    (acc, expense) => {
      const category = expense.category || "Sem categoria";
      acc[category] = (acc[category] ?? 0) + getAmount(expense);
      return acc;
    },
    {} as Record<string, number>,
  );

  const topCategory = Object.entries(expensesByCategory).sort(
    (a, b) => b[1] - a[1],
  )[0];

  if (topCategory) {
    insights.push({
      type: "info",
      title: "Maior categoria de gasto",
      description: `${topCategory[0]} concentra ${formatCurrency(
        topCategory[1],
      )} em despesas.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "Poucos dados para análise",
      description:
        "Continue registrando seus lançamentos para receber insights melhores.",
    });
  }

  return {
    score,
    balance,
    income,
    expenses: totalExpenses,
    savingsRate,
    insights,
  };
}