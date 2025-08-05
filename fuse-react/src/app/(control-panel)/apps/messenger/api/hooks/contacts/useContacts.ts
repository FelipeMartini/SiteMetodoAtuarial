import { useQuery } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';

export const contactsQueryKey = ['messenger', 'contacts'] as const;

export function useContacts() {
	return useQuery({
		queryFn: messengerApiService.contacts.getAll,
		queryKey: contactsQueryKey
	});
}
