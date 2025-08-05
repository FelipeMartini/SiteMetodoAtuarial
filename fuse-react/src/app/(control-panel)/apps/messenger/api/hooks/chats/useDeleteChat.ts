import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';
import { chatMessagesQueryKey } from './useChatMessages';
import { chatsQueryKey } from './useChats';

export function useDeleteChat() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: messengerApiService.chats.delete,
		onSuccess: (_, chatId) => {
			queryClient.invalidateQueries({ queryKey: chatsQueryKey });
			queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey(chatId) });
		}
	});
}
