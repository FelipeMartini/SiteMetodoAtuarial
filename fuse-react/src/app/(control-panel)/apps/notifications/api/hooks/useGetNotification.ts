import { useQuery } from '@tanstack/react-query';
import { notificationsApiService } from '../services/notificationsApiService';

export const notificationQueryKey = (id: string) => ['notifications', 'detail', id] as const;

export const useGetNotification = (id: string) => {
	return useQuery({
		queryFn: () => notificationsApiService.getById(id),
		queryKey: notificationQueryKey(id),
		enabled: !!id
	});
};
