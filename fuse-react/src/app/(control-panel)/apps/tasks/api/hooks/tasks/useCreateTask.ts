import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApiService } from '../../services/tasksApiService';
import type { Task } from '../../types';
import { tasksQueryKey } from './useGetTasks';

export function useCreateTask() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (task: Omit<Task, 'id'>) => tasksApiService.createTask(task),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tasksQueryKey });
		}
	});
}
