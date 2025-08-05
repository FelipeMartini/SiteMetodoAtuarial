import { useQuery } from '@tanstack/react-query';
import { profileApiService } from '../services/profileApiService';

export const profileAlbumsQueryKey = ['profile', 'albums'];

export const useProfileAlbums = () => {
	return useQuery({
		queryFn: profileApiService.getAlbums,
		queryKey: profileAlbumsQueryKey
	});
};
