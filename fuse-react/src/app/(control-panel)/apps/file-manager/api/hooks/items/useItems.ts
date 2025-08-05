import { useQuery } from '@tanstack/react-query';
import { fileManagerApi } from '../../services/fileManagerApiService';

export const itemsQueryKey = (path: string) => ['file-manager', 'items', path];

export const useItems = (path: string) => {
	return useQuery({
		queryFn: () => fileManagerApi.getItems(path),
		queryKey: itemsQueryKey(path)
	});
};
