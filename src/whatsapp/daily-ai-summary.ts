export class DailyAiSummary {
  static generate(params: {
    total: number;
    categories: Record<string, number>;
    count: number;
  }) {
    const { total, categories, count } = params;

    const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);

    const topCategory = sorted[0];

    let tone = 'normal';

    if (total > 200) tone = 'alto';
    if (total < 50) tone = 'baixo';

    const insights: string[] = [];

    if (topCategory) {
      insights.push(
        `O maior gasto foi em ${topCategory[0]} (R$ ${topCategory[1].toFixed(2)}).`,
      );
    }

    if (tone === 'alto') {
      insights.push('Seus gastos hoje estão acima da média.');
    } else if (tone === 'baixo') {
      insights.push('Você teve um dia econômico hoje.');
    } else {
      insights.push('Seus gastos estão dentro do padrão normal.');
    }

    return {
      text:
        `📊 *Resumo inteligente do dia*\n\n` +
        `${insights.join('\n')}\n\n` +
        `💰 Total: R$ ${total.toFixed(2)}\n` +
        `📌 Transações: ${count}`,
    };
  }
}
