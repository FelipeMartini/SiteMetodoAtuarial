import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';
import { teamMembersQueryKey } from './useTeamMembers';

export function useUpdateTeamMembers() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: settingsApiService.updateTeamMembers,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: teamMembersQueryKey });
		}
	});
}
