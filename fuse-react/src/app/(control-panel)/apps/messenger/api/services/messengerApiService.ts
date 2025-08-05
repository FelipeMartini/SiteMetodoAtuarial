import { api } from '@/utils/api';
import type { Chat, Contact, Message, Profile } from '../types';
import { PartialDeep } from 'type-fest/source/partial-deep';

const demoUserId = 'cfaad35d-07a3-4447-a6c3-d8c3d54fd5df';

export const messengerApiService = {
	contacts: {
		getAll: () => api.get('mock/messenger/contacts').json<Contact[]>(),
		getById: (id: string) => api.get(`mock/messenger/contacts/${id}`).json<Contact>(),
		update: (contact: Contact) => api.put(`mock/messenger/contacts/${contact.id}`, { json: contact }).json(),
		delete: (id: string) => api.delete(`mock/messenger/contacts/${id}`).json()
	},
	chats: {
		getAll: () => api.get('mock/messenger/chat-list').json<Chat[]>(),
		create: (chat: PartialDeep<Chat>) => api.post('mock/messenger/chat-list', { json: chat }).json<Chat>(),
		getMessages: (chatId: string) =>
			api.get('mock/messenger/messages', { searchParams: { chatId } }).json<Message[]>(),
		delete: (chatId: string) => api.delete('mock/messenger/messages', { searchParams: { chatId } }).json(),
		sendMessage: ({ chatId, message }: { chatId: string; message: string }) =>
			api
				.post('mock/messenger/messages', {
					json: {
						chatId,
						contactId: demoUserId,
						value: message,
						createdAt: new Date().toISOString()
					}
				})
				.json<Message[]>()
	},
	profile: {
		get: () => api.get(`mock/messenger/profiles/${demoUserId}`).json<Profile>(),
		update: (profile: PartialDeep<Profile>) =>
			api.put(`mock/messenger/profiles/${demoUserId}`, { json: profile }).json<Profile>()
	}
};
