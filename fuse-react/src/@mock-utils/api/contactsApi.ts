import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const contactsApi = [
	/**
	 * GET api/mock/contacts/items
	 */
	http.get('/api/mock/contacts/items', async ({ request }) => {
		const api = mockApi('contacts_items');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/contacts/items
	 */
	http.post('/api/mock/contacts/items', async ({ request }) => {
		const api = mockApi('contacts_items');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/contacts/items/:id
	 */
	http.get('/api/mock/contacts/items/:id', async ({ params }) => {
		const api = mockApi('contacts_items');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/contacts/items/:id
	 */
	http.put('/api/mock/contacts/items/:id', async ({ params, request }) => {
		const api = mockApi('contacts_items');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/contacts/items/:id
	 */
	http.delete('/api/mock/contacts/items/:id', async ({ params }) => {
		const api = mockApi('contacts_items');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/contacts/tags/:id
	 */
	http.get('/api/mock/contacts/tags/:id', async ({ params }) => {
		const api = mockApi('contacts_tags');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/contacts/tags/:id
	 */
	http.put('/api/mock/contacts/tags/:id', async ({ params, request }) => {
		const api = mockApi('contacts_tags');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/contacts/tags/:id
	 */
	http.delete('/api/mock/contacts/tags/:id', async ({ params }) => {
		const api = mockApi('contacts_tags');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/contacts/tags
	 */
	http.get('/api/mock/contacts/tags', async ({ request }) => {
		const api = mockApi('contacts_tags');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/contacts/tags
	 */
	http.post('/api/mock/contacts/tags', async ({ request }) => {
		const api = mockApi('contacts_tags');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	})
];

export default contactsApi;
