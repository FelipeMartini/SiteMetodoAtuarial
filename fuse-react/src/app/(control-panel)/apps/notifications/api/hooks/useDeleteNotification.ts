import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApiService } from '../services/notificationsApiService';
import { notificationsQueryKey } from './useGetAllNotifications';
export const useDeleteNotification = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notificationsApiService.delete,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: notificationsQueryKey
			});
		}
	});
};
