import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { scrumboardBoardsQueryKey } from './useGetScrumboardBoards';

export function useDeleteScrumboardBoard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.deleteScrumboardBoard,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scrumboardBoardsQueryKey });
		}
	});
}
