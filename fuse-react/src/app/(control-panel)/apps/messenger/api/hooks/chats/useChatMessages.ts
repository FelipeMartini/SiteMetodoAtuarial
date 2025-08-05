import { useQuery } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';

export const chatMessagesQueryKey = (chatId: string) => ['messenger', 'chat', chatId, 'messages'] as const;

export function useChatMessages(chatId: string) {
	return useQuery({
		queryFn: () => messengerApiService.chats.getMessages(chatId),
		queryKey: chatMessagesQueryKey(chatId)
	});
}
