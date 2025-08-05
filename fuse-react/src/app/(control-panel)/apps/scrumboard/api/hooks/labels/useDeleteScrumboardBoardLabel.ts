import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardLabelsQueryKey } from './useGetScrumboardBoardLabels';

export function useDeleteScrumboardBoardLabel(boardId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.deleteScrumboardBoardLabel,
		onSuccess: () => {
			if (boardId) {
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardLabelsQueryKey(boardId) });
			}
		}
	});
}
