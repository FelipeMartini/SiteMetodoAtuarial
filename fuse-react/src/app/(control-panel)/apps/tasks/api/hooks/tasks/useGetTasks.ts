import { useQuery } from '@tanstack/react-query';
import { tasksApiService } from '../../services/tasksApiService';

export const tasksQueryKey = ['tasksApp', 'tasks'];

export function useGetTasks() {
	return useQuery({
		queryFn: tasksApiService.getTasks,
		queryKey: tasksQueryKey
	});
}
