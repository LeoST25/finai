import { formatCurrency } from "@/utils/format-currency";

type Props = {
  value: number;
};

export function Currency({
  value,
}: Props) {
  return (
    <>
      {formatCurrency(value)}
    </>
  );
}