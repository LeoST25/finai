import { ExpenseType } from '../expenses/dto/create-expense.dto';
import { ExpenseCategorizer } from './expense-categorizer';
import { ExpenseTypeDetector } from './expense-type-detector';

export class ExpenseMessageParser {
  static parse(text: string) {
    const normalized = text
      .toLowerCase()
      .replace(',', '.')
      .trim();

    const valueMatch = normalized.match(/\d+(\.\d{1,2})?/);

    if (!valueMatch) return null;

    const value = Number(valueMatch[0]);

    const description = normalized
      .replace(valueMatch[0], '')
      .replace('gastei', '')
      .replace('paguei', '')
      .replace('comprei', '')
      .replace('recebi', '')
      .replace('ganhei', '')
      .replace('de', '')
      .replace('no', '')
      .replace('na', '')
      .replace('em', '')
      .trim();

    if (!description) return null;

    const type = ExpenseTypeDetector.detect(normalized);
    const category = ExpenseCategorizer.categorize(description);

    return {
      description,
      category,
      value,
      type: type as ExpenseType,
    };
  }
}