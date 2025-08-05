import { LabelColorsType } from '../../components/ui/mail/labelColors';

export type RouteParams = Record<string, unknown>;

export type MailboxMailAttachment = {
	type: string;
	name: string;
	size: number;
	preview?: string;
	downloadUrl?: string;
};

export type MailboxMail = {
	id: string;
	type: string;
	from: {
		avatar: string;
		contact: string;
		email: string;
	};
	to: string;
	cc?: string[];
	bcc?: string[];
	date: string;
	subject: string;
	content: string;
	attachments: MailboxMailAttachment[];
	starred: boolean;
	important: boolean;
	unread: boolean;
	folder: string;
	labels: string[];
};

export type MailboxFilter = {
	id: string;
	title: string;
	slug: string;
	icon: string;
};

export type MailboxLabel = {
	id: string;
	title?: string;
	slug?: string;
	color?: LabelColorsType;
};

export type MailboxFolder = {
	id: string;
	title: string;
	slug: string;
	icon: string;
};

export type MailboxAction =
	| 'important'
	| 'starred'
	| 'unread'
	| 'folder'
	| 'labels'
	| 'label'
	| 'sent'
	| 'drafts'
	| 'trash'
	| 'spam'
	| 'all';
