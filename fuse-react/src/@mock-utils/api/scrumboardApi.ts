import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const scrumboardApi = [
	/**
	 * GET api/mock/scrumboard/members
	 */
	http.get('/api/mock/scrumboard/members', async ({ request }) => {
		const api = mockApi('scrumboard_members');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/scrumboard/members
	 */
	http.post('/api/mock/scrumboard/members', async ({ request }) => {
		const api = mockApi('scrumboard_members');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/scrumboard/members/:id
	 */
	http.get('/api/mock/scrumboard/members/:id', async ({ params }) => {
		const api = mockApi('scrumboard_members');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/scrumboard/members/:id
	 */
	http.put('/api/mock/scrumboard/members/:id', async ({ params, request }) => {
		const api = mockApi('scrumboard_members');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/scrumboard/members/:id
	 */
	http.delete('/api/mock/scrumboard/members/:id', async ({ params }) => {
		const api = mockApi('scrumboard_members');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/scrumboard/lists
	 */
	http.get('/api/mock/scrumboard/lists', async ({ request }) => {
		const api = mockApi('scrumboard_lists');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/scrumboard/lists
	 */
	http.post('/api/mock/scrumboard/lists', async ({ request }) => {
		const api = mockApi('scrumboard_lists');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/scrumboard/lists/:id
	 */
	http.get('/api/mock/scrumboard/lists/:id', async ({ params }) => {
		const api = mockApi('scrumboard_lists');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/scrumboard/lists/:id
	 */
	http.put('/api/mock/scrumboard/lists/:id', async ({ params, request }) => {
		const api = mockApi('scrumboard_lists');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/scrumboard/lists/:id
	 */
	http.delete('/api/mock/scrumboard/lists/:id', async ({ params }) => {
		const api = mockApi('scrumboard_lists');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/scrumboard/labels
	 */
	http.get('/api/mock/scrumboard/labels', async ({ request }) => {
		const api = mockApi('scrumboard_labels');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/scrumboard/labels
	 */
	http.post('/api/mock/scrumboard/labels', async ({ request }) => {
		const api = mockApi('scrumboard_labels');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/scrumboard/labels/:id
	 */
	http.get('/api/mock/scrumboard/labels/:id', async ({ params }) => {
		const api = mockApi('scrumboard_labels');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/scrumboard/labels/:id
	 */
	http.put('/api/mock/scrumboard/labels/:id', async ({ params, request }) => {
		const api = mockApi('scrumboard_labels');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/scrumboard/labels/:id
	 */
	http.delete('/api/mock/scrumboard/labels/:id', async ({ params }) => {
		const api = mockApi('scrumboard_labels');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/scrumboard/cards
	 */
	http.get('/api/mock/scrumboard/cards', async ({ request }) => {
		const api = mockApi('scrumboard_cards');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/scrumboard/cards
	 */
	http.post('/api/mock/scrumboard/cards', async ({ request }) => {
		const api = mockApi('scrumboard_cards');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/scrumboard/cards/:id
	 */
	http.get('/api/mock/scrumboard/cards/:id', async ({ params }) => {
		const api = mockApi('scrumboard_cards');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/scrumboard/cards/:id
	 */
	http.put('/api/mock/scrumboard/cards/:id', async ({ params, request }) => {
		const api = mockApi('scrumboard_cards');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/scrumboard/cards/:id
	 */
	http.delete('/api/mock/scrumboard/cards/:id', async ({ params }) => {
		const api = mockApi('scrumboard_cards');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/scrumboard/boards
	 */
	http.get('/api/mock/scrumboard/boards', async ({ request }) => {
		const api = mockApi('scrumboard_boards');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/scrumboard/boards
	 */
	http.post('/api/mock/scrumboard/boards', async ({ request }) => {
		const api = mockApi('scrumboard_boards');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/scrumboard/boards/:id
	 */
	http.get('/api/mock/scrumboard/boards/:id', async ({ params }) => {
		const api = mockApi('scrumboard_boards');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/scrumboard/boards/:id
	 */
	http.put('/api/mock/scrumboard/boards/:id', async ({ params, request }) => {
		const api = mockApi('scrumboard_boards');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/scrumboard/boards/:id
	 */
	http.delete('/api/mock/scrumboard/boards/:id', async ({ params }) => {
		const api = mockApi('scrumboard_boards');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	})
];

export default scrumboardApi;
