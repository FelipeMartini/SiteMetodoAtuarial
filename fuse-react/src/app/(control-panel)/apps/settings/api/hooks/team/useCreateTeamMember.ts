import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';
import { teamMembersQueryKey } from './useTeamMembers';

export function useCreateTeamMember() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: settingsApiService.createTeamMember,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamMembersQueryKey });
		}
	});
}
