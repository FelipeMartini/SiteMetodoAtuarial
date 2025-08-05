import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { scrumboardMembersQueryKey } from './useGetScrumboardMembers';

export function useCreateScrumboardMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.createScrumboardMember,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scrumboardMembersQueryKey });
		}
	});
}
