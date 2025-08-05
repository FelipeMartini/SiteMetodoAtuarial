import { useQuery } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';

export const getScrumboardBoardLabelsQueryKey = (boardId: string) => ['scrumboard', 'board-labels', boardId];

export function useGetScrumboardBoardLabels(boardId: string) {
	return useQuery({
		queryFn: () => scrumboardApiService.getScrumboardBoardLabels(boardId),
		queryKey: getScrumboardBoardLabelsQueryKey(boardId),
		enabled: !!boardId
	});
}
