import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardQueryKey } from '../boards/useGetScrumboardBoard';

export function useDeleteScrumboardBoardList(boardId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.deleteScrumboardBoardList,
		onSuccess: () => {
			// Invalidate the board to reflect list deletion
			if (boardId) {
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardQueryKey(boardId) });
			}
		}
	});
}
