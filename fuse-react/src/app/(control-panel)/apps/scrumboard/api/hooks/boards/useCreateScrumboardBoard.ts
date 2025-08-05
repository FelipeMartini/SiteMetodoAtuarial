import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import { scrumboardBoardsQueryKey } from './useGetScrumboardBoards';

export function useCreateScrumboardBoard() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: scrumboardApiService.createScrumboardBoard,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: scrumboardBoardsQueryKey });
		}
	});
}
