import { useQuery } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { Contact } from '../../types';

export const contactsListQueryKey = ['contacts', 'list'];

export const useContactsList = () => {
	return useQuery<Contact[]>({
		queryFn: contactsApi.getContactsList,
		queryKey: contactsListQueryKey
	});
};
