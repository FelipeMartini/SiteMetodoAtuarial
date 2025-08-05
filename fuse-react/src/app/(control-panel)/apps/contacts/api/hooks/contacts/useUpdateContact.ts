import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { contactsListQueryKey } from './useContactsList';
import { contactQueryKey } from './useContact';

export const useUpdateContact = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: contactsApi.updateContact,
		onSuccess: (_, contact) => {
			queryClient.invalidateQueries({ queryKey: contactsListQueryKey });
			queryClient.invalidateQueries({ queryKey: contactQueryKey(contact.id) });
		}
	});
};
