import { useQuery } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';

export const useArchivedNotes = () => {
	return useQuery({
		queryKey: ['notes', 'archived'],
		queryFn: () => notesApiService.getArchivedNotes()
	});
};
