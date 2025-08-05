import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';
import { planBillingSettingsQueryKey } from './usePlanBillingSettings';

export function useUpdatePlanBillingSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: settingsApiService.updatePlanBillingSettings,
		onSuccess: (data) => {
			queryClient.setQueryData(planBillingSettingsQueryKey, data);
		}
	});
}
