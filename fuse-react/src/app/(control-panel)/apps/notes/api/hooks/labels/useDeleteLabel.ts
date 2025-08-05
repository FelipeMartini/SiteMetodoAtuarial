import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';
import { labelsQueryKey } from './useLabels';
import { labelQueryKey } from './useLabel';

export function useDeleteLabel() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notesApiService.deleteLabel,
		onSuccess: (_, labelId) => {
			queryClient.invalidateQueries({ queryKey: labelsQueryKey });
			queryClient.removeQueries({ queryKey: labelQueryKey(labelId) });
		}
	});
}
