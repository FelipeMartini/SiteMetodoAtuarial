import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardCardsQueryKey } from './useGetScrumboardBoardCards';

export function useDeleteScrumboardBoardCard(boardId?: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.deleteScrumboardBoardCard,
		onSuccess: () => {
			if (boardId) {
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardCardsQueryKey(boardId) });
			}
		}
	});
}
