import { NotificationPanelContext } from './NotificationPanelContext';
import { useContext } from 'react';

export function useNotificationPanelContext() {
	const context = useContext(NotificationPanelContext);

	if (!context) {
		throw new Error('useNotificationPanel must be used within a NotificationPanelProvider');
	}

	return context;
}
