import { useMutation, useQueryClient } from '@tanstack/react-query';
import { messengerApiService } from '../../services/messengerApiService';
import { contactQueryKey } from './useContact';
import { contactsQueryKey } from './useContacts';

export function useUpdateContact() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: messengerApiService.contacts.update,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: contactsQueryKey });
			queryClient.invalidateQueries({ queryKey: contactQueryKey(variables.id) });
		}
	});
}
