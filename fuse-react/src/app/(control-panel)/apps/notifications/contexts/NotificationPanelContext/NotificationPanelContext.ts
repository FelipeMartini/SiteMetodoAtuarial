import { createContext } from 'react';

type NotificationPanelContextType = {
	isOpen: boolean;
	toggle: () => void;
	open: () => void;
	close: () => void;
};

export const NotificationPanelContext = createContext<NotificationPanelContextType | null>(null);
