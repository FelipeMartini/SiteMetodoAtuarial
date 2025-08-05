import { useMemo } from 'react';
import FuseUtils from '@fuse/utils';
import { useSearch } from './useSearch';
import { Contact } from '../api/types';
import { useContactsList } from '../api/hooks/contacts/useContactsList';

export function useFilteredContacts() {
	const { searchText } = useSearch();
	const { data: contacts, isLoading } = useContactsList();
	const filteredContacts = useMemo(() => {
		if (!contacts || isLoading) {
			return [];
		}

		if (searchText.length === 0) {
			return contacts;
		}

		if (searchText.length === 0) {
			return contacts;
		}

		return FuseUtils.filterArrayByString<Contact>(contacts, searchText);
	}, [contacts, searchText, isLoading]);

	return { data: filteredContacts, isLoading };
}
