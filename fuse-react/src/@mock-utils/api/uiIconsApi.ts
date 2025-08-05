import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const uiIconsApi = [
	/**
	 * GET api/mock/ui-icons/lucide
	 */
	http.get('/api/mock/ui-icons/lucide', async ({ request }) => {
		const api = mockApi('ui_icons_lucide');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),
	/**
	 * GET api/mock/ui-icons/feather
	 */
	http.get('/api/mock/ui-icons/feather', async ({ request }) => {
		const api = mockApi('ui_icons_feather');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/ui-icons/heroicons
	 */
	http.get('/api/mock/ui-icons/heroicons', async ({ request }) => {
		const api = mockApi('ui_icons_heroicons');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/ui-icons/material
	 */
	http.get('/api/mock/ui-icons/material', async ({ request }) => {
		const api = mockApi('ui_icons_material');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default uiIconsApi;
