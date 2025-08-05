import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aiImageGenApi } from '../../services/aiImageGenApiService';
import { presetsQueryKey } from './usePresets';

export const useCreatePreset = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: aiImageGenApi.createPreset,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: presetsQueryKey });
		}
	});
};
