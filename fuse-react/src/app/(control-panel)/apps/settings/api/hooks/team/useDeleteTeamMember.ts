import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';
import { teamMembersQueryKey } from './useTeamMembers';

export function useDeleteTeamMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: settingsApiService.deleteTeamMember,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamMembersQueryKey });
		}
	});
}
