import { ReactNode, useCallback, useEffect, useState } from 'react';
import _ from 'lodash';
import type { MailboxMail } from '../../api/types';
import { MailboxAppContext } from './MailboxAppContext';
import useThemeMediaQuery from '../../../../../../@fuse/hooks/useThemeMediaQuery';
import useParams from '@fuse/hooks/useParams';
import usePathname from '@fuse/hooks/usePathname';

type MailboxProviderProps = {
	children: ReactNode;
};

export function MailboxAppProvider({ children }: MailboxProviderProps) {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const [selectedMailIds, setSelectedMailIds] = useState<string[]>([]);
	const [searchText, setSearchTextState] = useState('');

	const routeParams = useParams();
	const [_category, _subCategory, mailId] = routeParams?.mailParams || [];

	const pathname = usePathname();

	useEffect(() => {
		if (isMobile) {
			setRightSidebarOpen(Boolean(mailId));
		} else {
			setRightSidebarOpen(true);
		}
	}, [mailId, isMobile]);

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			setLeftSidebarOpen(false);
		}
	}, [pathname, isMobile]);

	const selectAllMails = useCallback((mails: MailboxMail[]) => {
		setSelectedMailIds(mails.map((mail) => mail.id));
	}, []);

	const deselectAllMails = useCallback(() => {
		setSelectedMailIds([]);
	}, []);

	const toggleInSelectedMails = useCallback((mailId: string) => {
		setSelectedMailIds((prev) => _.xor(prev, [mailId]));
	}, []);

	const handleSetSearchText = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTextState(event.target.value || '');
	}, []);

	const toggleLeftSidebarOpen = useCallback(() => {
		setLeftSidebarOpen((prev) => !prev);
	}, []);

	const value = {
		selectedMailIds,
		searchText,
		setSelectedMailIds,
		selectAllMails,
		deselectAllMails,
		toggleInSelectedMails,
		setSearchText: handleSetSearchText,
		leftSidebarOpen,
		setLeftSidebarOpen,
		toggleLeftSidebarOpen,
		rightSidebarOpen,
		setRightSidebarOpen
	};

	return <MailboxAppContext.Provider value={value}>{children}</MailboxAppContext.Provider>;
}
