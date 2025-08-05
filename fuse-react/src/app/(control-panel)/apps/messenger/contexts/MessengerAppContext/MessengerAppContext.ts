import { createContext } from 'react';

export type MessengerAppContextType = {
	setMainSidebarOpen: (isOpen?: boolean) => void;
	setContactSidebarOpen: (contactId?: string) => void;
	setUserSidebarOpen: (isOpen?: boolean) => void;
	contactSidebarOpen?: string;
	mainSidebarOpen: boolean;
	userSidebarOpen: boolean;
};

export const MessengerAppContext = createContext<MessengerAppContextType>({
	setMainSidebarOpen: () => {},
	setContactSidebarOpen: (_T: string) => {},
	setUserSidebarOpen: () => {},
	contactSidebarOpen: null,
	mainSidebarOpen: false,
	userSidebarOpen: false
});
