import { useQuery } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';

export const getScrumboardBoardQueryKey = (boardId: string) => ['scrumboard', 'board', boardId];

export function useGetScrumboardBoard(boardId: string) {
	return useQuery({
		queryFn: () => scrumboardApiService.getScrumboardBoard(boardId),
		queryKey: getScrumboardBoardQueryKey(boardId),
		enabled: !!boardId
	});
}
