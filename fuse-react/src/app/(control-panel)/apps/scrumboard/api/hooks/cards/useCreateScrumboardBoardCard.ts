import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardCardsQueryKey } from './useGetScrumboardBoardCards';
import { getScrumboardBoardQueryKey } from '../boards/useGetScrumboardBoard';

export function useCreateScrumboardBoardCard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.createScrumboardBoardCard,
		onSuccess: (_, variables) => {
			// Invalidate cards list and the board to reflect new card
			queryClient.invalidateQueries({ queryKey: getScrumboardBoardCardsQueryKey(variables.boardId) });
			queryClient.invalidateQueries({ queryKey: getScrumboardBoardQueryKey(variables.boardId) });
		}
	});
}
