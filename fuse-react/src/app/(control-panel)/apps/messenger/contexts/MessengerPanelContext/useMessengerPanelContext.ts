import { useContext } from 'react';
import { MessengerPanelContext } from './MessengerPanelContext';

export function useMessengerPanelContext() {
	const context = useContext(MessengerPanelContext);

	if (context === undefined) {
		throw new Error('useMessengerPanel must be used within a MessengerPanelProvider');
	}

	return context;
}
