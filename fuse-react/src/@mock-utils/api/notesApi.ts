import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const notesApi = [
	/**
	 * GET api/mock/notes/items
	 */
	http.get('/api/mock/notes/items', async ({ request }) => {
		const api = mockApi('notes_items');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/notes/items
	 */
	http.post('/api/mock/notes/items', async ({ request }) => {
		const api = mockApi('notes_items');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/notes/items/:id
	 */
	http.get('/api/mock/notes/items/:id', async ({ params }) => {
		const api = mockApi('notes_items');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/notes/items/:id
	 */
	http.put('/api/mock/notes/items/:id', async ({ params, request }) => {
		const api = mockApi('notes_items');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/notes/items/:id
	 */
	http.delete('/api/mock/notes/items/:id', async ({ params }) => {
		const api = mockApi('notes_items');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/notes/labels
	 */
	http.get('/api/mock/notes/labels', async ({ request }) => {
		const api = mockApi('notes_labels');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/notes/labels
	 */
	http.post('/api/mock/notes/labels', async ({ request }) => {
		const api = mockApi('notes_labels');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/notes/labels/:id
	 */
	http.get('/api/mock/notes/labels/:id', async ({ params }) => {
		const api = mockApi('notes_labels');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/notes/labels/:id
	 */
	http.put('/api/mock/notes/labels/:id', async ({ params, request }) => {
		const api = mockApi('notes_labels');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/notes/labels/:id
	 */
	http.delete('/api/mock/notes/labels/:id', async ({ params }) => {
		const api = mockApi('notes_labels');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	})
];

export default notesApi;
