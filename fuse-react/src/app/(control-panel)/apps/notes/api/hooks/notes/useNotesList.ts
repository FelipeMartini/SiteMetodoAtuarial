import { useQuery } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';
import type { RouteParams } from '../../types';
import useParams from '@fuse/hooks/useParams';

export const notesListQueryKey = (params?: RouteParams) =>
	['notes', 'list', ...(params?.filter ? [params.filter] : []), ...(params?.id ? [params.id] : [])] as const;

export const useNotesList = () => {
	const routeParams = useParams();
	return useQuery({
		queryFn: () => notesApiService.getNotesList(routeParams),
		queryKey: notesListQueryKey(routeParams),
		staleTime: 0
	});
};
