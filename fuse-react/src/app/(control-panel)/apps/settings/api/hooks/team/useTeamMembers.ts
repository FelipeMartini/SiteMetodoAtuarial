import { useQuery } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';

export const teamMembersQueryKey = ['settings', 'team-members'] as const;

export function useTeamMembers() {
	return useQuery({
		queryKey: teamMembersQueryKey,
		queryFn: settingsApiService.getTeamMembers
	});
}
