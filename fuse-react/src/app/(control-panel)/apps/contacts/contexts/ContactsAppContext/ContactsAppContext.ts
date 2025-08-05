import { createContext } from 'react';

export type ContactsAppState = {
	searchText: string;
	setSearchText: (text: string) => void;
	resetSearchText: () => void;
};

export const ContactsAppContext = createContext<ContactsAppState | null>(null);
