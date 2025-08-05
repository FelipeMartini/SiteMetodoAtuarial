import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApiService } from '../../services/tasksApiService';
import { tasksQueryKey } from './useGetTasks';

export function useUpdateTasks() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: tasksApiService.updateTasks,
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: tasksQueryKey });
		}
	});
}
