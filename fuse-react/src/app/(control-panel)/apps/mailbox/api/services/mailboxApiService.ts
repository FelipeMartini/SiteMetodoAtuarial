import { api } from '@/utils/api';
import type { MailboxMail, MailboxFilter, MailboxLabel, MailboxFolder } from '../types';

export const mailboxApi = {
	getMails: (params?: Record<string, string>) =>
		api.get(`mock/mailbox/mails`, { searchParams: params }).json<MailboxMail[]>(),

	getMail: (mailId: string) => api.get(`mock/mailbox/mails/${mailId}`).json<MailboxMail>(),

	updateMails: (mails: Partial<MailboxMail>[]) => api.put(`mock/mailbox/mails`, { json: mails }).json(),

	createMail: ({ folderSlug, mail }: { folderSlug: string; mail: MailboxMail }) =>
		api.post(`mock/mailbox/mails`, { json: { folderSlug, mail } }).json(),

	getFilters: () => api.get(`mock/mailbox/filters`).json<MailboxFilter[]>(),

	getLabels: () => api.get(`mock/mailbox/labels`).json<MailboxLabel[]>(),

	updateLabel: (labelSlug: string, label: MailboxLabel) =>
		api.put(`mock/mailbox/labels/${labelSlug}`, { json: label }).json<MailboxLabel>(),

	getFolders: () => api.get(`mock/mailbox/folders`).json<MailboxFolder[]>()
};
