import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createGoal } from '@/features/goals/services';

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoal,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['goals'],
      });
    },
  });
}
