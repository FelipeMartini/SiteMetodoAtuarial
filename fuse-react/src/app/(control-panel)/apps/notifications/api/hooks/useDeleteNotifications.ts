import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApiService } from '../services/notificationsApiService';

import { notificationsQueryKey } from './useGetAllNotifications';
export const useDeleteNotifications = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: notificationsApiService.deleteMany,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: notificationsQueryKey
			});
		}
	});
};
