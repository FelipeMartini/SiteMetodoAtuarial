import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { scrumboardMembersQueryKey } from './useGetScrumboardMembers';
import { getScrumboardMemberQueryKey } from './useGetScrumboardMember';

export function useUpdateScrumboardMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.updateScrumboardMember,
		onSuccess: (_, variables) => {
			// Invalidate specific member and the members list
			if (variables.id) {
				queryClient.invalidateQueries({ queryKey: getScrumboardMemberQueryKey(variables.id) });
			}

			queryClient.invalidateQueries({ queryKey: scrumboardMembersQueryKey });
		}
	});
}
