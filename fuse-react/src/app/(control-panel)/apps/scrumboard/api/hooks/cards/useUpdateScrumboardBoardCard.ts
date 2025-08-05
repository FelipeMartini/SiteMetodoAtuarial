import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardCardsQueryKey } from './useGetScrumboardBoardCards';

export function useUpdateScrumboardBoardCard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.updateScrumboardBoardCard,
		onSuccess: (_, variables) => {
			if (variables.boardId) {
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardCardsQueryKey(variables.boardId) });
			}
		}
	});
}
