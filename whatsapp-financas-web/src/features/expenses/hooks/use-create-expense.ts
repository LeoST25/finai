import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpense } from "@/features/expenses/services/expenses.service";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
}