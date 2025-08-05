import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';
import { noteQueryKey } from './useNote';
import { notesListQueryKey } from './useNotesList';

export function useUpdateNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notesApiService.updateNote,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: noteQueryKey(variables.id) });
			queryClient.invalidateQueries({ queryKey: notesListQueryKey() });
		}
	});
}
