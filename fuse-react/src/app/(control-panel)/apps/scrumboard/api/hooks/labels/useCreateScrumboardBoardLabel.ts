import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { getScrumboardBoardLabelsQueryKey } from './useGetScrumboardBoardLabels';

export function useCreateScrumboardBoardLabel() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.createScrumboardBoardLabel,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: getScrumboardBoardLabelsQueryKey(variables.boardId) });
		}
	});
}
