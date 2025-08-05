import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const notificationsApi = [
	/**
	 * GET api/mock/notifications
	 */
	http.get('/api/mock/notifications', async ({ request }) => {
		const api = mockApi('notifications');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/notifications
	 */
	http.post('/api/mock/notifications', async ({ request }) => {
		const api = mockApi('notifications');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * DELETE api/mock/notifications
	 */
	http.delete('/api/mock/notifications', async ({ request }) => {
		const api = mockApi('notifications');
		const data = (await request.json()) as string[];
		const result = await api.delete(data);
		return HttpResponse.json({ success: result.success });
	}),

	/**
	 * GET api/mock/notifications/:id
	 */
	http.get('/api/mock/notifications/:id', async ({ params }) => {
		const api = mockApi('notifications');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * DELETE api/mock/notifications/:id
	 */
	http.delete('/api/mock/notifications/:id', async ({ params }) => {
		const api = mockApi('notifications');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	})
];

export default notificationsApi;
