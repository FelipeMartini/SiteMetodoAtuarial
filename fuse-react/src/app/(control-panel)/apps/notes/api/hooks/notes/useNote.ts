import { useQuery } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';

export const noteQueryKey = (noteId: string) => ['notes', 'detail', noteId] as const;

export const useNote = (noteId: string) => {
	return useQuery({
		queryFn: () => notesApiService.getNote(noteId),
		queryKey: noteQueryKey(noteId),
		enabled: !!noteId
	});
};
