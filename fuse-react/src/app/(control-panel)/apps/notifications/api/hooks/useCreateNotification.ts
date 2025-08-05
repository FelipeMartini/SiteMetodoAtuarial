import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApiService } from '../services/notificationsApiService';
import { notificationsQueryKey } from './useGetAllNotifications';
export const useCreateNotification = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notificationsApiService.create,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: notificationsQueryKey
			});
		}
	});
};
