import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const calendarApi = [
	/**
	 * GET api/mock/calendar/events
	 */
	http.get('/api/mock/calendar/events', async ({ request }) => {
		const api = mockApi('calendar_events');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/calendar/events
	 */
	http.post('/api/mock/calendar/events', async ({ request }) => {
		const api = mockApi('calendar_events');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * PUT api/mock/calendar/events/:id
	 */
	http.put('/api/mock/calendar/events/:id', async ({ params, request }) => {
		const api = mockApi('calendar_events');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/calendar/events/:id
	 */
	http.delete('/api/mock/calendar/events/:id', async ({ params }) => {
		const api = mockApi('calendar_events');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/calendar/labels
	 */
	http.get('/api/mock/calendar/labels', async ({ request }) => {
		const api = mockApi('calendar_labels');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/calendar/labels
	 */
	http.post('/api/mock/calendar/labels', async ({ request }) => {
		const api = mockApi('calendar_labels');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * PUT api/mock/calendar/labels/:id
	 */
	http.put('/api/mock/calendar/labels/:id', async ({ params, request }) => {
		const api = mockApi('calendar_labels');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/calendar/labels/:id
	 */
	http.delete('/api/mock/calendar/labels/:id', async ({ params }) => {
		const api = mockApi('calendar_labels');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	})
];

export default calendarApi;
