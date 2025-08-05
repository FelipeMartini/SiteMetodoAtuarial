import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { scrumboardMembersQueryKey } from './useGetScrumboardMembers';

export function useDeleteScrumboardMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.deleteScrumboardMember,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scrumboardMembersQueryKey });
		}
	});
}
