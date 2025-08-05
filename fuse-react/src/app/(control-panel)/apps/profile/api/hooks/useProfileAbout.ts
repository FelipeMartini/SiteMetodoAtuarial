import { useQuery } from '@tanstack/react-query';
import { profileApiService } from '../services/profileApiService';

export const profileAboutQueryKey = ['profile', 'about'];

export const useProfileAbout = () => {
	return useQuery({
		queryFn: profileApiService.getAbout,
		queryKey: profileAboutQueryKey
	});
};
