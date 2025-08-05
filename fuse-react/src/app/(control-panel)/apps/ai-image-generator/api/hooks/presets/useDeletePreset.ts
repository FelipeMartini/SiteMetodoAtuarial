import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiImageGenApi } from '../../services/aiImageGenApiService';
import { presetsQueryKey } from './usePresets';
export const useDeletePreset = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: aiImageGenApi.deletePreset,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: presetsQueryKey });
		}
	});
};
