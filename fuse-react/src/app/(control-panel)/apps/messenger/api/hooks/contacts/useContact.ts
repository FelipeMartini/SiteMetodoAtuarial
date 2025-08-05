import { useQuery } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';

export const contactQueryKey = (id: string) => ['messenger', 'contact', id] as const;

export function useContact(id: string) {
	return useQuery({
		queryFn: () => messengerApiService.contacts.getById(id),
		queryKey: contactQueryKey(id),
		enabled: !!id
	});
}
