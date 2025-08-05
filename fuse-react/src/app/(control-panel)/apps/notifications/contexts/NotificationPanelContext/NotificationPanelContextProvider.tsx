import { NotificationPanelContext } from './NotificationPanelContext';
import { useCallback, useState } from 'react';

export function NotificationPanelContextProvider({ children }: { children: React.ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	const toggle = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, []);

	const open = useCallback(() => {
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
	}, []);

	return (
		<NotificationPanelContext.Provider value={{ isOpen, toggle, open, close }}>
			{children}
		</NotificationPanelContext.Provider>
	);
}
