import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardListsQueryKey } from './useGetScrumboardBoardLists';
import { getScrumboardBoardListQueryKey } from './useGetScrumboardBoardList';

export function useUpdateScrumboardBoardList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.updateScrumboardBoardList,
		onSuccess: (_, variables) => {
			// Invalidate specific list and the lists for its board
			queryClient.invalidateQueries({ queryKey: getScrumboardBoardListQueryKey(variables.id) });

			if (variables.boardId) {
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardListsQueryKey(variables.boardId) });
			}
		}
	});
}
