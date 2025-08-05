import { useContext } from 'react';
import { ContactsAppContext } from './ContactsAppContext';

export function useContactsAppContext() {
	const context = useContext(ContactsAppContext);

	if (!context) {
		throw new Error('useContactsApp must be used within a ContactsAppProvider');
	}

	return context;
}
