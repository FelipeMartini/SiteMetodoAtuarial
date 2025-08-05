import { api } from '@/utils/api';
import { Contact, Country, Tag } from '../types';

export const contactsApi = {
	getContactsList: async (): Promise<Contact[]> => {
		return api.get('mock/contacts/items').json();
	},

	getContact: async (contactId: string): Promise<Contact> => {
		return api.get(`mock/contacts/items/${contactId}`).json();
	},

	createContact: async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
		return api
			.post('mock/contacts/items', {
				json: contact
			})
			.json();
	},

	updateContact: async (contact: Contact): Promise<Contact> => {
		return api
			.put(`mock/contacts/items/${contact.id}`, {
				json: contact
			})
			.json();
	},

	deleteContact: async (contactId: string): Promise<void> => {
		await api.delete(`mock/contacts/items/${contactId}`);
	},

	getTags: async (): Promise<Tag[]> => {
		return api.get('mock/contacts/tags').json();
	},

	getTag: async (tagId: string): Promise<Tag> => {
		return api.get(`mock/contacts/tags/${tagId}`).json();
	},

	createTag: async (tag: Omit<Tag, 'id'>): Promise<Tag> => {
		return api
			.post('mock/contacts/tags', {
				json: tag
			})
			.json();
	},

	updateTag: async (tag: Tag): Promise<Tag> => {
		return api
			.put(`mock/contacts/tags/${tag.id}`, {
				json: tag
			})
			.json();
	},

	deleteTag: async (tagId: string): Promise<void> => {
		await api.delete(`mock/contacts/tags/${tagId}`);
	},

	getCountries: async (): Promise<Country[]> => {
		return api.get('mock/countries').json();
	}
};
