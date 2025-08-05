import { useQuery } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';

export const notificationSettingsQueryKey = ['settings', 'notifications'] as const;

export function useNotificationSettings() {
	return useQuery({
		queryKey: notificationSettingsQueryKey,
		queryFn: settingsApiService.getNotificationSettings
	});
}
