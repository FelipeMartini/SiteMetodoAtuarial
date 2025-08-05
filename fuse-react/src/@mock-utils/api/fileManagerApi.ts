import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const fileManagerApi = [
	/**
	 * GET api/mock/file-manager/items
	 */
	http.get('/api/mock/file-manager/items', async ({ request }) => {
		const api = mockApi('file_manager_items');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/file-manager/items/:id
	 */
	http.get('/api/mock/file-manager/items/:id', async ({ params }) => {
		const api = mockApi('file_manager_items');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/file-manager/items/:id
	 */
	http.put('/api/mock/file-manager/items/:id', async ({ params, request }) => {
		const api = mockApi('file_manager_items');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/file-manager/items/:id
	 */
	http.delete('/api/mock/file-manager/items/:id', async ({ params }) => {
		const api = mockApi('file_manager_items');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	})
];

export default fileManagerApi;
