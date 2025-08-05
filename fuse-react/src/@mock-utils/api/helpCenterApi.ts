import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const helpCenterApi = [
	/**
	 * GET api/mock/help-center/guides
	 */
	http.get('/api/mock/help-center/guides', async ({ request }) => {
		const api = mockApi('help_center_guides');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/help-center/guides/:id
	 */
	http.get('/api/mock/help-center/guides/:id', async ({ params }) => {
		const api = mockApi('help_center_guides');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * GET api/mock/help-center/guide-categories
	 */
	http.get('/api/mock/help-center/guide-categories', async ({ request }) => {
		const api = mockApi('help_center_guide_categories');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/help-center/faqs
	 */
	http.get('/api/mock/help-center/faqs', async ({ request }) => {
		const api = mockApi('help_center_faqs');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/help-center/faqs-categories
	 */
	http.get('/api/mock/help-center/faqs-categories', async ({ request }) => {
		const api = mockApi('help_center_faqs_categories');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default helpCenterApi;
