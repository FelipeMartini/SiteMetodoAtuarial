import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { contactsListQueryKey } from './useContactsList';
import { contactQueryKey } from './useContact';

export const useDeleteContact = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: contactsApi.deleteContact,
		onSuccess: (_, contactId) => {
			queryClient.invalidateQueries({ queryKey: contactsListQueryKey });
			queryClient.invalidateQueries({ queryKey: contactQueryKey(contactId) });
		}
	});
};
