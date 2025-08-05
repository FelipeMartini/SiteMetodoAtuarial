import { useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { contactsListQueryKey } from './useContactsList';

export const useCreateContact = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: contactsApi.createContact,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: contactsListQueryKey });
		}
	});
};
