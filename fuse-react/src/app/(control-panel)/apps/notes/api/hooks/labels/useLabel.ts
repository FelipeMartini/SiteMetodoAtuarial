import { useQuery } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';

export const labelQueryKey = (labelId: string) => ['notes', 'labels', labelId] as const;

export const useLabel = (labelId: string) => {
	return useQuery({
		queryFn: () => notesApiService.getLabel(labelId),
		queryKey: labelQueryKey(labelId),
		enabled: !!labelId
	});
};
