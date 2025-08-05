import { useContactsAppContext } from '../contexts/ContactsAppContext/useContactsAppContext';

export function useSearch() {
	const { searchText, setSearchText, resetSearchText } = useContactsAppContext();

	return {
		searchText,
		setSearchText,
		resetSearchText
	};
}
