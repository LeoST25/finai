type CurrencyProps = {
  value: number;
  currency?: string;
  locale?: string;
  className?: string;
};

export function Currency({
  value,
  currency = "BRL",
  locale = "pt-BR",
  className,
}: CurrencyProps) {
  const formattedValue = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

  return <span className={className}>{formattedValue}</span>;
}