import { useQuery } from '@tanstack/react-query';
import { profileApiService } from '../services/profileApiService';

export const profileActivitiesQueryKey = ['profile', 'activities'];

export const useProfileActivities = () => {
	return useQuery({
		queryFn: profileApiService.getActivities,
		queryKey: profileActivitiesQueryKey
	});
};
