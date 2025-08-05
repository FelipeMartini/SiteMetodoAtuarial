import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardLabelQueryKey } from './useGetScrumboardBoardLabel';
import { getScrumboardBoardLabelsQueryKey } from './useGetScrumboardBoardLabels';

export function useUpdateScrumboardBoardLabel() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.updateScrumboardBoardLabel,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: getScrumboardBoardLabelQueryKey(variables.id) });

			if (variables.boardId) {
				queryClient.invalidateQueries({ queryKey: getScrumboardBoardLabelsQueryKey(variables.boardId) });
			}
		}
	});
}
