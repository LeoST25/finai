import { z } from "zod";

function normalizeCurrencyValue(value: string): number {
  const sanitizedValue = value.trim().replace(/\s/g, "");

  if (sanitizedValue.includes(",")) {
    return Number(
      sanitizedValue
        .replace(/\./g, "")
        .replace(",", "."),
    );
  }

  return Number(sanitizedValue);
}

const optionalDescriptionSchema = z
  .string()
  .trim()
  .max(
    500,
    "A descrição deve ter no máximo 500 caracteres.",
  );

const optionalDeadlineSchema = z
  .string()
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      const date = new Date(`${value}T00:00:00`);

      return !Number.isNaN(date.getTime());
    },
    {
      message: "Informe uma data válida.",
    },
  );

export const goalFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Informe um título com pelo menos 2 caracteres.")
    .max(
      100,
      "O título deve ter no máximo 100 caracteres.",
    ),

  description: optionalDescriptionSchema,

  category: z
    .string()
    .trim()
    .min(2, "Informe ou selecione uma categoria.")
    .max(
      50,
      "A categoria deve ter no máximo 50 caracteres.",
    ),

  type: z.enum(["savings", "expense-limit"], {
    message: "Selecione o tipo da meta.",
  }),

  targetAmount: z
    .string()
    .trim()
    .min(1, "Informe o valor objetivo.")
    .refine(
      (value) => {
        const numericValue = normalizeCurrencyValue(value);

        return (
          Number.isFinite(numericValue) &&
          numericValue > 0
        );
      },
      {
        message:
          "Informe um valor objetivo maior que zero.",
      },
    ),

  currentAmount: z
    .string()
    .trim()
    .refine(
      (value) => {
        if (!value) {
          return true;
        }

        const numericValue = normalizeCurrencyValue(value);

        return (
          Number.isFinite(numericValue) &&
          numericValue >= 0
        );
      },
      {
        message:
          "O valor atual deve ser um número igual ou maior que zero.",
      },
    ),

  deadline: optionalDeadlineSchema,
});

export type GoalFormData = z.infer<
  typeof goalFormSchema
>;

export { normalizeCurrencyValue };