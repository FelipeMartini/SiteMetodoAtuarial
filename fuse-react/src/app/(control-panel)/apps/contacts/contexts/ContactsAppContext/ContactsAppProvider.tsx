import { useState, ReactNode } from 'react';
import { ContactsAppContext } from './ContactsAppContext';

export function ContactsAppProvider({ children }: { children: ReactNode }) {
	const [searchText, setSearchText] = useState('');

	const resetSearchText = () => {
		setSearchText('');
	};

	const value = {
		searchText,
		setSearchText,
		resetSearchText
	};

	return <ContactsAppContext.Provider value={value}>{children}</ContactsAppContext.Provider>;
}
