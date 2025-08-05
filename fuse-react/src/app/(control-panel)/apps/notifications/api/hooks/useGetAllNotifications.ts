import { useQuery } from '@tanstack/react-query';
import { notificationsApiService } from '../services/notificationsApiService';

export const notificationsQueryKey = ['notifications', 'list'] as const;

export const useGetAllNotifications = () => {
	return useQuery({
		queryFn: notificationsApiService.getAll,
		queryKey: notificationsQueryKey
	});
};
