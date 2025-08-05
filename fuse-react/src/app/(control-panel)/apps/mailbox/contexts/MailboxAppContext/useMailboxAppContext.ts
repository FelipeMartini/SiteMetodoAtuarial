import { MailboxAppContext } from './MailboxAppContext';

import { useContext } from 'react';

export function useMailboxAppContext() {
	const context = useContext(MailboxAppContext);

	if (context === undefined) {
		throw new Error('useMailbox must be used within a MailboxProvider');
	}

	return context;
}
