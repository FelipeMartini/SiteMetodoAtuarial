import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';
import { labelsQueryKey } from './useLabels';
import { labelQueryKey } from './useLabel';

export function useUpdateLabel() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notesApiService.updateLabel,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: labelsQueryKey });
			queryClient.invalidateQueries({ queryKey: labelQueryKey(variables.id) });
		}
	});
}
