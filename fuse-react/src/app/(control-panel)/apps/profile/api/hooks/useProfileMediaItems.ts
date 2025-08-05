import { useQuery } from '@tanstack/react-query';
import { profileApiService } from '../services/profileApiService';

export const profileMediaItemsQueryKey = ['profile', 'media-items'];

export const useProfileMediaItems = () => {
	return useQuery({
		queryFn: profileApiService.getMediaItems,
		queryKey: profileMediaItemsQueryKey
	});
};
