import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApiService } from '../../services/tasksApiService';
import { tagsQueryKey } from './useGetTags';

export function useCreateTag() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: tasksApiService.createTag,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: tagsQueryKey });
		}
	});
}
