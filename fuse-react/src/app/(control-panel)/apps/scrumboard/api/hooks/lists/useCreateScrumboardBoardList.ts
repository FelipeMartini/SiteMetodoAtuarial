import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardListsQueryKey } from './useGetScrumboardBoardLists';
import { getScrumboardBoardQueryKey } from '../boards/useGetScrumboardBoard';

export function useCreateScrumboardBoardList() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.createScrumboardBoardList,
		onSuccess: (_, variables) => {
			// Invalidate board lists and the specific board
			if (variables.boardId) {
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardListsQueryKey(variables.boardId) });
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardQueryKey(variables.boardId) });
			}
		}
	});
}
