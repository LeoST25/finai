import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteGoal } from '@/features/goals/services';

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGoal,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['goals'],
      });
    },
  });
}
