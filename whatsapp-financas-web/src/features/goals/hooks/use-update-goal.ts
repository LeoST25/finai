import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateGoal } from '@/features/goals/services';

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGoal,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['goals'],
      });
    },
  });
}
