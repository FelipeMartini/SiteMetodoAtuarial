import { useQuery } from '@tanstack/react-query';
import { contactsApi } from '../../services/contactsApiService';
import { Contact } from '../../types';

export const contactQueryKey = (contactId: string) => ['contacts', 'item', contactId];

export const useContact = (contactId: string) => {
	return useQuery<Contact>({
		queryFn: () => contactsApi.getContact(contactId),
		queryKey: contactQueryKey(contactId),
		enabled: !!contactId
	});
};
