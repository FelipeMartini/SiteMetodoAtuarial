import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const messengerApi = [
	/**
	 * GET api/mock/messenger/contacts
	 */
	http.get('/api/mock/messenger/contacts', async ({ request }) => {
		const api = mockApi('messenger_contacts');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/messenger/contacts/:id
	 */
	http.get('/api/mock/messenger/contacts/:id', async ({ params }) => {
		const api = mockApi('messenger_contacts');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/messenger/contacts/:id
	 */
	http.put('/api/mock/messenger/contacts/:id', async ({ params, request }) => {
		const api = mockApi('messenger_contacts');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/messenger/contacts/:id
	 */
	http.delete('/api/mock/messenger/contacts/:id', async ({ params }) => {
		const api = mockApi('messenger_contacts');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/messenger/chat-list
	 */
	http.get('/api/mock/messenger/chat-list', async ({ request }) => {
		const api = mockApi('messenger_chat_list');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/messenger/chat-list
	 */
	http.post('/api/mock/messenger/chat-list', async ({ request }) => {
		const api = mockApi('messenger_chat_list');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/messenger/messages
	 */
	http.get('/api/mock/messenger/messages', async ({ request }) => {
		const api = mockApi('messenger_messages');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/messenger/messages
	 */
	http.post('/api/mock/messenger/messages', async ({ request }) => {
		const api = mockApi('messenger_messages');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/messenger/profiles
	 */
	http.get('/api/mock/messenger/profiles', async ({ request }) => {
		const api = mockApi('messenger_profiles');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/messenger/profiles/:id
	 */
	http.get('/api/mock/messenger/profiles/:id', async ({ params }) => {
		const api = mockApi('messenger_profiles');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/messenger/profiles/:id
	 */
	http.put('/api/mock/messenger/profiles/:id', async ({ params, request }) => {
		const api = mockApi('messenger_profiles');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	})
];

export default messengerApi;
