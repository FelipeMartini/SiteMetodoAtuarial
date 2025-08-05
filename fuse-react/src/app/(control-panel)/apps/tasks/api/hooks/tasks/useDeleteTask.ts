import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApiService } from '../../services/tasksApiService';
import { tasksQueryKey } from './useGetTasks';

export function useDeleteTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (taskId: string) => tasksApiService.deleteTask(taskId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tasksQueryKey });
		}
	});
}
