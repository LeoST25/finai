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
  private async getTodaySummary(): Promise<string> {
    const expenses = await this.expensesService.findAll();
    const today = new Date().toDateString();
    const todayExpenses = expenses.filter(
      (expense) =>
        expense.type === 'expense' &&
        new Date(expense.createdAt).toDateString() === today,
    );
    const total = this.calculateTotal(todayExpenses);
    return `📊 *Resumo de hoje* 💰 Total gasto: ${this.formatCurrency(total)} 📌 Lançamentos: ${todayExpenses.length}`;
  }
  private async getMonthSummary(): Promise<string> {
    const expenses = await this.expensesService.findAll();
    const now = new Date();
    const monthExpenses = expenses.filter((expense) => {
      const date = new Date(expense.createdAt);
      return (
        expense.type === 'expense' &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
    const total = this.calculateTotal(monthExpenses);
    return `📆 *Resumo do mês* 💰 Total gasto: ${this.formatCurrency(total)} 📌 Lançamentos: ${monthExpenses.length}`;
  }
  private async getWeekSummary(): Promise<string> {
    const expenses = await this.expensesService.findAll();
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const weekExpenses = expenses.filter((expense) => {
      const date = new Date(expense.createdAt);
      return expense.type === 'expense' && date >= startOfWeek && date <= now;
    });
    const total = this.calculateTotal(weekExpenses);
    return `📅 *Resumo da semana* 💰 Total gasto: ${this.formatCurrency(total)} 📌 Lançamentos: ${weekExpenses.length}`;
  }
  private async getBalanceSummary(): Promise<string> {
    const expenses = await this.expensesService.findAll();
    const totalIncome = this.calculateTotal(
      expenses.filter((expense) => expense.type === 'income'),
    );
    const totalExpense = this.calculateTotal(
      expenses.filter((expense) => expense.type === 'expense'),
    );
    const balance = totalIncome - totalExpense;
    return `💼 *Saldo geral* 🟢 Receitas: ${this.formatCurrency(totalIncome)} 🔴 Gastos: ${this.formatCurrency(totalExpense)} 💰 Saldo: ${this.formatCurrency(balance)}`;
  }
  private calculateTotal(
    expenses: Awaited<ReturnType<ExpensesService['findAll']>>,
  ): number {
    return expenses.reduce(
      (total, expense) => total + Number(expense.value),
      0,
    );
  }
  private formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
}
