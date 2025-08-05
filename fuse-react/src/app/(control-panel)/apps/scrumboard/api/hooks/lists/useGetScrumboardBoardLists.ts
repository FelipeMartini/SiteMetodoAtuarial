import { useQuery } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';

export const getScrumboardBoardListsQueryKey = (boardId: string) => ['scrumboard', 'board-lists', boardId];

export function useGetScrumboardBoardLists(boardId: string) {
	return useQuery({
		queryFn: () => scrumboardApiService.getScrumboardBoardLists(boardId),
		queryKey: getScrumboardBoardListsQueryKey(boardId),
		enabled: !!boardId
	});
}
