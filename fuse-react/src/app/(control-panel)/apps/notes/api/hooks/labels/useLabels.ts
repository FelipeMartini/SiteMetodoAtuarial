import { useQuery } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';

export const labelsQueryKey = ['notes', 'labels'] as const;

export const useLabels = () => {
	return useQuery({
		queryFn: notesApiService.getLabels,
		queryKey: labelsQueryKey
	});
};
