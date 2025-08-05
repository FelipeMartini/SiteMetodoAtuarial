import { useThemeMediaQuery } from '@fuse/hooks';
import usePathname from '@fuse/hooks/usePathname';
import { useEffect, useMemo, useState } from 'react';
import { MessengerAppContext } from './MessengerAppContext';

export const MessengerAppContextProvider = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [mainSidebarOpen, setMainSidebarOpen] = useState(!isMobile);
	const [contactSidebarOpen, setContactSidebarOpen] = useState<string | null>(null);
	const [userSidebarOpen, setUserSidebarOpen] = useState(false);

	useEffect(() => {
		setMainSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			setMainSidebarOpen(false);
		}
	}, [pathname, isMobile]);

	useEffect(() => {
		if (isMobile && userSidebarOpen) {
			setMainSidebarOpen(false);
		}
	}, [isMobile, userSidebarOpen]);

	const MessengerAppContextData = useMemo(
		() => ({
			mainSidebarOpen,
			setMainSidebarOpen,
			contactSidebarOpen,
			setContactSidebarOpen,
			userSidebarOpen,
			setUserSidebarOpen
		}),
		[
			mainSidebarOpen,
			setMainSidebarOpen,
			contactSidebarOpen,
			setContactSidebarOpen,
			userSidebarOpen,
			setUserSidebarOpen
		]
	);

	return <MessengerAppContext.Provider value={MessengerAppContextData}>{children}</MessengerAppContext.Provider>;
};
