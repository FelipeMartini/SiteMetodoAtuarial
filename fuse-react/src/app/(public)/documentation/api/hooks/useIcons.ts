import { useQuery } from '@tanstack/react-query';
import { iconsApiService } from '../services/iconsApiService';

export const getIconsQueryKey = (url: string) => ['icons', url];

export const useIcons = (url: string) => {
	return useQuery({
		queryFn: () => iconsApiService.getIcons(url),
		queryKey: getIconsQueryKey(url)
	});
};
