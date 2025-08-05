import { useQuery } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';

export const securitySettingsQueryKey = ['settings', 'security'] as const;

export function useSecuritySettings() {
	return useQuery({
		queryFn: settingsApiService.getSecuritySettings,
		queryKey: securitySettingsQueryKey
	});
}
