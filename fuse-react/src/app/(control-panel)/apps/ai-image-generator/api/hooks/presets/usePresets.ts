import { useQuery } from '@tanstack/react-query';
import { aiImageGenApi } from '../../services/aiImageGenApiService';

export const presetsQueryKey = ['aiImageGen', 'presets'];

export const usePresets = () => {
	return useQuery({
		queryKey: presetsQueryKey,
		queryFn: aiImageGenApi.getPresets
	});
};
