import { useQuery } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';

export const getScrumboardMemberQueryKey = (memberId: string) => ['scrumboard', 'member', memberId];

export function useGetScrumboardMember(memberId: string) {
	return useQuery({
		queryFn: () => scrumboardApiService.getScrumboardMember(memberId),
		queryKey: getScrumboardMemberQueryKey(memberId),
		enabled: !!memberId
	});
}
