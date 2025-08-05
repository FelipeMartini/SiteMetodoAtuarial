import { useQuery } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';

export const accountSettingsQueryKey = ['settings', 'account'] as const;

export function useAccountSettings() {
	return useQuery({
		queryFn: settingsApiService.getAccountSettings,
		queryKey: accountSettingsQueryKey
	});
}
