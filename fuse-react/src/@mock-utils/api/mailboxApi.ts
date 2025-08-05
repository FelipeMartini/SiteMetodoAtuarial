import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const mailboxApi = [
	/**
	 * GET api/mock/mailbox/mails
	 */
	http.get('/api/mock/mailbox/mails', async ({ request }) => {
		const api = mockApi('mailbox_mails');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/mailbox/mails
	 */
	http.post('/api/mock/mailbox/mails', async ({ request }) => {
		const api = mockApi('mailbox_mails');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * PUT api/mock/mailbox/mails
	 */
	http.put('/api/mock/mailbox/mails', async ({ request }) => {
		const api = mockApi('mailbox_mails');
		const data = (await request.json()) as { id: string }[];
		const result = await api.updateMany(data);
		return HttpResponse.json(result);
	}),

	/**
	 * GET api/mock/mailbox/mails/:id
	 */
	http.get('/api/mock/mailbox/mails/:id', async ({ params }) => {
		const api = mockApi('mailbox_mails');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * GET api/mock/mailbox/filters
	 */
	http.get('/api/mock/mailbox/filters', async ({ request }) => {
		const api = mockApi('mailbox_filters');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/mailbox/labels
	 */
	http.get('/api/mock/mailbox/labels', async ({ request }) => {
		const api = mockApi('mailbox_labels');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/mailbox/labels
	 */
	http.post('/api/mock/mailbox/labels', async ({ request }) => {
		const api = mockApi('mailbox_labels');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * PUT api/mock/mailbox/labels/:id
	 */
	http.put('/api/mock/mailbox/labels/:id', async ({ params, request }) => {
		const api = mockApi('mailbox_labels');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/mailbox/labels/:id
	 */
	http.delete('/api/mock/mailbox/labels/:id', async ({ params }) => {
		const api = mockApi('mailbox_labels');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/mailbox/folders
	 */
	http.get('/api/mock/mailbox/folders', async ({ request }) => {
		const api = mockApi('mailbox_folders');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default mailboxApi;
