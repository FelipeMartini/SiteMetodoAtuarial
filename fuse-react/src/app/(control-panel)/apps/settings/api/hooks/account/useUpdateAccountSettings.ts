import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApiService } from '../../services/settingsApiService';
import { accountSettingsQueryKey } from './useAccountSettings';

export function useUpdateAccountSettings() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: settingsApiService.updateAccountSettings,
		onSuccess: (data) => {
			queryClient.setQueryData(accountSettingsQueryKey, data);
		}
	});
}
