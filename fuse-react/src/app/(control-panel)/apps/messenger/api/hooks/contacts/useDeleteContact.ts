import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';
import { contactQueryKey } from './useContact';
import { contactsQueryKey } from './useContacts';

export function useDeleteContact() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: messengerApiService.contacts.delete,
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: contactsQueryKey });
			queryClient.invalidateQueries({ queryKey: contactQueryKey(id) });
		}
	});
}
