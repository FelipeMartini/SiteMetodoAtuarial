import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const usersApi = [
	/**
	 * GET api/mock/users
	 */
	http.get('/api/mock/users', async ({ request }) => {
		const api = mockApi('users');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/users
	 */
	http.post('/api/mock/users', async ({ request }) => {
		const api = mockApi('users');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * PUT api/mock/users/:id
	 */
	http.put('/api/mock/users/:id', async ({ params, request }) => {
		const api = mockApi('users');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * GET api/mock/users/:id
	 */
	http.get('/api/mock/users/:id', async ({ params }) => {
		const api = mockApi('users');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	})
];

export default usersApi;
