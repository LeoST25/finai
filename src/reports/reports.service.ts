import { Injectable } from '@nestjs/common';
import { ExpensesService } from '../expenses/expenses.service';
import { DailyAiSummary } from '../whatsapp/daily-ai-summary';
@Injectable()
export class ReportsService {
  constructor(private readonly expensesService: ExpensesService) {}
  async generateDailySummary() {
    const expenses = await this.expensesService.findAll();
    const today = new Date().toDateString();
    const todayExpenses = expenses.filter(
      (expense) => new Date(expense.createdAt).toDateString() === today,
    );
    if (todayExpenses.length === 0) {
      return null;
    }
    const total = todayExpenses.reduce(
      (acc, expense) => acc + Number(expense.value),
      0,
    );
    const byCategory: Record<string, number> = {};
    for (const expense of todayExpenses) {
      byCategory[expense.category] =
        (byCategory[expense.category] ?? 0) + Number(expense.value);
    }
    const summary = DailyAiSummary.generate({
      total,
      categories: byCategory,
      count: todayExpenses.length,
    });
    return summary.text;
  }
}
