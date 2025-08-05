import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';
import { profileQueryKey } from './useProfile';

export function useUpdateProfile() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: messengerApiService.profile.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: profileQueryKey });
		}
	});
}
