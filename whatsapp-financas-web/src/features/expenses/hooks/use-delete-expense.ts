import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteExpense } from "@/features/expenses/services/expenses.service";

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });
    },
  });
}