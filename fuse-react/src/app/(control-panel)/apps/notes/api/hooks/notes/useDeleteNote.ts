import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';
import { notesListQueryKey } from './useNotesList';
import { noteQueryKey } from './useNote';

export function useDeleteNote() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notesApiService.deleteNote,
		onSuccess: (_, noteId) => {
			queryClient.invalidateQueries({ queryKey: notesListQueryKey() });
			queryClient.removeQueries({ queryKey: noteQueryKey(noteId) });
		}
	});
}
