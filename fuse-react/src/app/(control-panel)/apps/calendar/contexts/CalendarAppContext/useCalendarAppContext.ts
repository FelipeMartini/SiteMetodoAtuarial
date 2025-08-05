import { CalendarAppContext } from './CalendarAppContext';
import { useContext } from 'react';

export function useCalendarAppContext() {
	const context = useContext(CalendarAppContext);

	if (!context) {
		throw new Error('useCalendarApp must be used within a CalendarAppProvider');
	}

	return context;
}
