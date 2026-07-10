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

function getExpenseDate(expense: Expense) {
  const record = expense as Expense & {
    date?: string | Date;
    createdAt?: string | Date;
  };

  return record.date ?? record.createdAt ?? new Date();
}

function isSameMonth(date: Date, reference: Date) {
  return (
    date.getMonth() === reference.getMonth() &&
    date.getFullYear() === reference.getFullYear()
  );
}

function isPreviousMonth(date: Date, reference: Date) {
  const previousMonth = new Date(reference);
  previousMonth.setMonth(previousMonth.getMonth() - 1);

  return (
    date.getMonth() === previousMonth.getMonth() &&
    date.getFullYear() === previousMonth.getFullYear()
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function analyzeFinancialData(expenses: Expense[]): FinancialAnalysis {
  const now = new Date();

  const income = expenses
    .filter(isIncome)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const totalExpenses = expenses
    .filter(isExpense)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const balance = income - totalExpenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : 0;

  const currentMonthExpenses = expenses.filter((expense) =>
    isSameMonth(new Date(getExpenseDate(expense)), now),
  );

  const previousMonthExpenses = expenses.filter((expense) =>
    isPreviousMonth(new Date(getExpenseDate(expense)), now),
  );

  const currentMonthTotal = currentMonthExpenses
    .filter(isExpense)
    .reduce((total, expense) => total + getAmount(expense), 0);

  const previousMonthTotal = previousMonthExpenses
    .filter(isExpense)
    .reduce((total, expense) => total + getAmount(expense), 0);

  let score = 50;

  if (balance > 0) score += 20;
  if (savingsRate >= 10) score += 10;
  if (savingsRate >= 20) score += 10;
  if (totalExpenses > income) score -= 25;
  if (income === 0 && totalExpenses > 0) score -= 20;
  if (currentMonthTotal > previousMonthTotal && previousMonthTotal > 0) {
    score -= 5;
  }

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

  if (previousMonthTotal > 0) {
    const variation =
      ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;

    if (variation > 20) {
      insights.push({
        type: "warning",
        title: "Despesas em alta",
        description: `Seus gastos deste mês estão ${variation.toFixed(
          1,
        )}% maiores que no mês anterior.`,
      });
    }

    if (variation < -10) {
      insights.push({
        type: "success",
        title: "Despesas em queda",
        description: `Você reduziu seus gastos em ${Math.abs(variation).toFixed(
          1,
        )}% em comparação ao mês anterior.`,
      });
    }
  }

  const today = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  if (today > 0 && currentMonthTotal > 0) {
    const projectedExpenses = (currentMonthTotal / today) * daysInMonth;

    insights.push({
      type: projectedExpenses > income && income > 0 ? "warning" : "info",
      title: "Projeção do mês",
      description: `No ritmo atual, suas despesas podem chegar a ${formatCurrency(
        projectedExpenses,
      )} até o fim do mês.`,
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