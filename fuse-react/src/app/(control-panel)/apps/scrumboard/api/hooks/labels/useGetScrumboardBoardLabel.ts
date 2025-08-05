import { useQuery } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';

export const getScrumboardBoardLabelQueryKey = (labelId: string) => ['scrumboard', 'board-label', labelId];

export function useGetScrumboardBoardLabel(labelId: string) {
	return useQuery({
		queryFn: () => scrumboardApiService.getScrumboardBoardLabel(labelId),
		queryKey: getScrumboardBoardLabelQueryKey(labelId),
		enabled: !!labelId
	});
}
