import { useQuery } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { ScrumboardMember } from '../../types';

export const scrumboardMembersQueryKey = ['scrumboard', 'members'] as const;

export function useGetScrumboardMembers() {
	return useQuery<ScrumboardMember[]>({
		queryFn: () => scrumboardApiService.getScrumboardMembers(),
		queryKey: scrumboardMembersQueryKey
	});
}
