export class ExpenseCategorizer {
  static categorize(text: string): string {
    const t = text.toLowerCase();

    // 🚗 transporte
    if (t.includes('uber') || t.includes('99') || t.includes('taxi')) {
      return 'transporte';
    }

    // 🍔 alimentação
    if (
      t.includes('ifood') ||
      t.includes('restaurante') ||
      t.includes('lanche') ||
      t.includes('pizza')
    ) {
      return 'alimentacao';
    }

    // 🛒 mercado
    if (t.includes('mercado') || t.includes('supermercado') || t.includes('atacadao')) {
      return 'mercado';
    }

    // 💰 receita
    if (t.includes('salario') || t.includes('freelance') || t.includes('pagamento')) {
      return 'receita';
    }

    // 🎮 lazer
    if (t.includes('netflix') || t.includes('spotify') || t.includes('cinema')) {
      return 'lazer';
    }

    return 'outros';
  }
}