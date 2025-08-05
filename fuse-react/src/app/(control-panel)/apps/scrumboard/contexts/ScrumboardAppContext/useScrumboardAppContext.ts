import { useContext } from 'react';
import { ScrumboardAppContext } from './ScrumboardAppContext';

export function useScrumboardAppContext() {
	const context = useContext(ScrumboardAppContext);

	if (!context) {
		throw new Error('useScrumboardApp must be used within a ScrumboardAppProvider');
	}

	return context;
}
