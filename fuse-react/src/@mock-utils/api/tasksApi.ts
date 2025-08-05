import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';
import { v4 as uuidv4 } from 'uuid';

const tasksApi = [
	/**
	 * GET api/mock/tasks/items
	 */
	http.get('/api/mock/tasks/items', async ({ request }) => {
		const api = mockApi('tasks_items');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/tasks/items
	 */
	http.post('/api/mock/tasks/items', async ({ request }) => {
		const api = mockApi('tasks_items');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = { ...data, id: data?.id || uuidv4(), order: 0 } as {
			id?: string;
			order: number;
		};

		const table = await api.findAll<{ order: number; id: string }>();
		const updatedTable = [
			...table.map((item) => ({
				...item,
				order: item.order + 1
			}))
		];

		await api.updateMany(updatedTable);

		await api.create(newItem);

		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * PUT api/mock/tasks/items
	 */
	http.put('/api/mock/tasks/items', async ({ request }) => {
		const api = mockApi('tasks_items');
		const data = (await request.json()) as { id: string }[];
		const result = await api.updateMany(data);
		return HttpResponse.json(result);
	}),

	/**
	 * GET api/mock/tasks/items/:id
	 */
	http.get('/api/mock/tasks/items/:id', async ({ params }) => {
		const api = mockApi('tasks_items');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * DELETE api/mock/tasks/items/:id
	 */
	http.delete('/api/mock/tasks/items/:id', async ({ params }) => {
		const api = mockApi('tasks_items');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * PUT api/mock/tasks/items/:id
	 */
	http.put('/api/mock/tasks/items/:id', async ({ params, request }) => {
		const api = mockApi('tasks_items');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * GET api/mock/tasks/tags
	 */
	http.get('/api/mock/tasks/tags', async ({ request }) => {
		const api = mockApi('tasks_tags');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/tasks/tags
	 */
	http.post('/api/mock/tasks/tags', async ({ request }) => {
		const api = mockApi('tasks_tags');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	})
];

export default tasksApi;
