import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';
import { notificationSettingsQueryKey } from './useNotificationSettings';

export function useUpdateNotificationSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: settingsApiService.updateNotificationSettings,
		onSuccess: (data) => {
			queryClient.setQueryData(notificationSettingsQueryKey, data);
		}
	});
}
