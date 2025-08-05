import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';
import { labelsQueryKey } from './useLabels';
export function useCreateLabel() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notesApiService.createLabel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: labelsQueryKey });
		}
	});
}
