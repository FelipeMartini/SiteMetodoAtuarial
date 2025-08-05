import { useQuery } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';

export const scrumboardBoardsQueryKey = ['scrumboard', 'boards'];

export function useGetScrumboardBoards() {
	return useQuery({
		queryFn: scrumboardApiService.getScrumboardBoards,
		queryKey: scrumboardBoardsQueryKey
	});
}
