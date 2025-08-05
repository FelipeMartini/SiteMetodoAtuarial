import { useQuery } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';

export const chatsQueryKey = ['messenger', 'chats'] as const;

export function useChats() {
	return useQuery({
		queryFn: messengerApiService.chats.getAll,
		queryKey: chatsQueryKey
	});
}
