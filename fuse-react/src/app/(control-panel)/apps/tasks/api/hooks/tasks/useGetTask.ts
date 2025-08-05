import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { tasksApiService } from '../../services/tasksApiService';
import type { Task } from '../../types';

export const getTaskQueryKey = (taskId: string) => ['tasksApp', 'task', taskId];

export function useGetTask(taskId: string, options: Partial<UseQueryOptions<Task>>) {
	return useQuery({
		queryFn: () => tasksApiService.getTask(taskId),
		queryKey: getTaskQueryKey(taskId),
		...options
	});
}
