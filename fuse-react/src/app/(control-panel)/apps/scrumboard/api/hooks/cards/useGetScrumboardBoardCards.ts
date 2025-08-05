import { useQuery } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';

export const getScrumboardBoardCardsQueryKey = (boardId: string) => ['scrumboard', 'board-cards', boardId];

export function useGetScrumboardBoardCards(boardId: string) {
	return useQuery({
		queryFn: () => scrumboardApiService.getScrumboardBoardCards(boardId),
		queryKey: getScrumboardBoardCardsQueryKey(boardId),
		enabled: !!boardId
	});
}
