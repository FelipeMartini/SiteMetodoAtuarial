import { createContext } from 'react';

type MessengerPanelContextType = {
	selectedChatId: string;
	open: boolean;
	setSelectedChatId: (chatId: string) => void;
	removeSelectedChatId: () => void;
	toggleChatPanel: () => void;
	openChatPanel: () => void;
	closeChatPanel: () => void;
};

export const MessengerPanelContext = createContext<MessengerPanelContextType | undefined>(undefined);
