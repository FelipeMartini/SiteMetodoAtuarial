import { useCallback, useState } from 'react';
import { MessengerPanelContext } from './MessengerPanelContext';

export function MessengerPanelContextProvider({ children }: { children: React.ReactNode }) {
	const [selectedChatId, setSelectedChatId] = useState('');
	const [open, setOpen] = useState(false);

	const removeSelectedChatId = useCallback(() => {
		setSelectedChatId('');
	}, []);

	const toggleChatPanel = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	const openChatPanel = useCallback(() => {
		setOpen(true);
	}, []);

	const closeChatPanel = useCallback(() => {
		setOpen(false);
	}, []);

	const value = {
		selectedChatId,
		open,
		setSelectedChatId,
		removeSelectedChatId,
		toggleChatPanel,
		openChatPanel,
		closeChatPanel
	};

	return <MessengerPanelContext.Provider value={value}>{children}</MessengerPanelContext.Provider>;
}
