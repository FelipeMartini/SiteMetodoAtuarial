export type ContactStatusType = 'online' | 'do-not-disturb' | 'away' | 'offline';

export type Contact = {
	id: string;
	avatar?: string | null;
	name: string;
	about: string;
	details: {
		emails: {
			email: string;
			label: string;
		}[];
		phoneNumbers: {
			country: string;
			phoneNumber: string;
			label: string;
		}[];
		title?: string;
		company: string;
		birthday: string;
		address: string;
	};
	attachments: {
		media: string[];
		docs: string[];
		links: string[];
	};
	status: ContactStatusType;
};

export type Chat = {
	id: string;
	contactIds: string[];
	unreadCount: number;
	muted: boolean;
	lastMessage: string;
	lastMessageAt: string;
};

export type Message = {
	id: string;
	chatId: string;
	contactId: string;
	value: string;
	createdAt: string;
};

export type Profile = {
	id: string;
	name: string;
	email: string;
	avatar: string;
	about: string;
};
