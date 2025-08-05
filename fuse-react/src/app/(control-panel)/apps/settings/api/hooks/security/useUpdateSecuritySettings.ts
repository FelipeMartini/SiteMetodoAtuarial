import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';
import { securitySettingsQueryKey } from './useSecuritySettings';

export function useUpdateSecuritySettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: settingsApiService.updateSecuritySettings,
		onSuccess: (data) => {
			queryClient.setQueryData(securitySettingsQueryKey, data);
		}
	});
}
