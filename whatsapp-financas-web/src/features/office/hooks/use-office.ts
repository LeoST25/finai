import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { officeService } from '../services/office.service';

export function useOfficeState() {
  return useQuery({
    queryKey: ['ai-office'],
    queryFn: officeService.getOfficeState,
    refetchInterval: 4000,
  });
}

export function useRunAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: officeService.runAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-office'] });
    },
  });
}

export function useRunStandup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: officeService.runStandup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-office'] });
    },
  });
}
