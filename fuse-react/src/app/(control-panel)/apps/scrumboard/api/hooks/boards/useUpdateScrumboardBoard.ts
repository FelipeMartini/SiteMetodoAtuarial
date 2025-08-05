import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { scrumboardBoardsQueryKey } from './useGetScrumboardBoards';
import { getScrumboardBoardQueryKey } from './useGetScrumboardBoard';

export function useUpdateScrumboardBoard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.updateScrumboardBoard,
		onSuccess: (_, variables) => {
			// Invalidate specific board and the boards list
			if (variables.id) {
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardQueryKey(variables.id) });
			}

			queryClient.invalidateQueries({ queryKey: scrumboardBoardsQueryKey });
		}
	});
}
