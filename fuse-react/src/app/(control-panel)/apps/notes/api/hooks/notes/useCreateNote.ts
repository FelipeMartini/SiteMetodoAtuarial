import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';
import { notesListQueryKey } from './useNotesList';
import useParams from '@fuse/hooks/useParams';

export function useCreateNote() {
	const queryClient = useQueryClient();
	const routeParams = useParams();

	return useMutation({
		mutationFn: notesApiService.createNote,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: notesListQueryKey(routeParams) });
		}
	});
}
