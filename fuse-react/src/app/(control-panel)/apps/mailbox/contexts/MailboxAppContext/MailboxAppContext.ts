import { createContext } from 'react';
import type { MailboxMail } from '../../api/types';

type MailboxContextType = {
	selectedMailIds: string[];
	searchText: string;
	setSelectedMailIds: (mailIds: string[]) => void;
	selectAllMails: (mails: MailboxMail[]) => void;
	deselectAllMails: () => void;
	toggleInSelectedMails: (mailId: string) => void;
	setSearchText: (event: React.ChangeEvent<HTMLInputElement>) => void;
	leftSidebarOpen: boolean;
	setLeftSidebarOpen: (open: boolean) => void;
	toggleLeftSidebarOpen: () => void;
	rightSidebarOpen: boolean;
	setRightSidebarOpen: (open: boolean) => void;
};

export const MailboxAppContext = createContext<MailboxContextType | undefined>(undefined);
