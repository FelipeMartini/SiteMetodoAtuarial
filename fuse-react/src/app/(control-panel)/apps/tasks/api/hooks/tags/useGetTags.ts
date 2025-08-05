import { useQuery } from '@tanstack/react-query';
import { tasksApiService } from '../../services/tasksApiService';

export const tagsQueryKey = ['tasksApp', 'tags'];

export function useGetTags() {
	return useQuery({
		queryFn: tasksApiService.getTags,
		queryKey: tagsQueryKey
	});
}
