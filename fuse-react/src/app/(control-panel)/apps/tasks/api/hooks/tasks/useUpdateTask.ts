import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApiService } from '../../services/tasksApiService';
import { tasksQueryKey } from './useGetTasks';
import { getTaskQueryKey } from './useGetTask';

export function useUpdateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: tasksApiService.updateTask,
		onSettled: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: tasksQueryKey });
			queryClient.invalidateQueries({ queryKey: getTaskQueryKey(id) });
		}
	});
}
