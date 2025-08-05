import { useQuery } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';

export const profileQueryKey = ['messenger', 'profile'] as const;

export function useProfile() {
	return useQuery({
		queryFn: messengerApiService.profile.get,
		queryKey: profileQueryKey
	});
}
