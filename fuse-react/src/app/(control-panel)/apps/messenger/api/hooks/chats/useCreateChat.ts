import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';
import { chatsQueryKey } from './useChats';

export function useCreateChat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: messengerApiService.chats.create,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatsQueryKey });
		}
	});
}
