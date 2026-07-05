import { Injectable } from '@nestjs/common';
import { ExpensesService } from '../expenses/expenses.service';

@Injectable()
export class WhatsappCommandService {
  constructor(private readonly expensesService: ExpensesService) {}

  async handle(command: string): Promise<string | null> {
    switch (command) {
      case 'hoje':
        return this.getTodaySummary();

      case 'mes':
      case 'mês':
        return this.getMonthSummary();

      case 'semana':
        return this.getWeekSummary();

      case 'saldo':
        return this.getBalanceSummary();

      default:
        return null;
    }
  }

  private async getTodaySummary() {
    const expenses = await this.expensesService.findAll();
    const today = new Date().toDateString();

    const todayExpenses = expenses.filter(
      (expense: { createdAt: Date }) =>
        new Date(expense.createdAt).toDateString() === today,
    );

    const total = todayExpenses.reduce(
      (acc: number, expense: { value: number }) => acc + expense.value,
      0,
    );

    return `📊 *Resumo de hoje*

💰 Total gasto: R$ ${total.toFixed(2)}
📌 Lançamentos: ${todayExpenses.length}`;
  }

  private async getMonthSummary() {
    const expenses = await this.expensesService.findAll();
    const now = new Date();

    const monthExpenses = expenses.filter((expense: { createdAt: Date }) => {
      const date = new Date(expense.createdAt);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });

    const total = monthExpenses.reduce(
      (acc: number, expense: { value: number }) => acc + expense.value,
      0,
    );

    return `📆 *Resumo do mês*

💰 Total gasto: R$ ${total.toFixed(2)}
📌 Lançamentos: ${monthExpenses.length}`;
  }

  private async getWeekSummary() {
    const expenses = await this.expensesService.findAll();
    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const weekExpenses = expenses.filter((expense: { createdAt: Date }) => {
      const date = new Date(expense.createdAt);
      return date >= startOfWeek && date <= now;
    });

    const total = weekExpenses.reduce(
      (acc: number, expense: { value: number }) => acc + expense.value,
      0,
    );

    return `📅 *Resumo da semana*

💰 Total gasto: R$ ${total.toFixed(2)}
📌 Lançamentos: ${weekExpenses.length}`;
  }

  private async getBalanceSummary() {
    const expenses = await this.expensesService.findAll();

    const incomes = expenses.filter(
      (expense: { type: string }) => expense.type === 'income',
    );

    const outcomes = expenses.filter(
      (expense: { type: string }) => expense.type === 'expense',
    );

    const totalIncome = incomes.reduce(
      (acc: number, expense: { value: number }) => acc + expense.value,
      0,
    );

    const totalExpense = outcomes.reduce(
      (acc: number, expense: { value: number }) => acc + expense.value,
      0,
    );

    const balance = totalIncome - totalExpense;

    return `💼 *Saldo geral*

🟢 Receitas: R$ ${totalIncome.toFixed(2)}
🔴 Gastos: R$ ${totalExpense.toFixed(2)}
💰 Saldo: R$ ${balance.toFixed(2)}`;
  }
}