import { useQuery } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';

export const planBillingSettingsQueryKey = ['settings', 'plan-billing'] as const;

export function usePlanBillingSettings() {
	return useQuery({
		queryKey: planBillingSettingsQueryKey,
		queryFn: settingsApiService.getPlanBillingSettings
	});
}
