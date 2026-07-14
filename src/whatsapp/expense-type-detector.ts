import { ExpenseType } from '../expenses/dto/create-expense.dto';

export class ExpenseTypeDetector {
  static detect(text: string): ExpenseType {
    const normalized = text.toLowerCase();

    const incomeWords = [
      'salario',
      'salário',
      'recebi',
      'receita',
      'pix recebido',
      'pagamento',
      'freelance',
      'bonus',
      'bônus',
    ];

    const isIncome = incomeWords.some((word) => normalized.includes(word));

    return isIncome ? ExpenseType.INCOME : ExpenseType.EXPENSE;
  }
}
