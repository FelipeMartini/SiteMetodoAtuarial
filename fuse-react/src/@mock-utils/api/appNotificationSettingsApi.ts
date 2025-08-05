import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const appNotificationSettingsApi = [
	/**
	 * GET api/mock/app-notification-settings
	 */
	http.get('/api/mock/app-notification-settings', async ({ request }) => {
		const api = mockApi('app_notification_settings');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/app-notification-settings/:id
	 */
	http.get('/api/mock/app-notification-settings/:id', async ({ params }) => {
		const api = mockApi('app_notification_settings');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/app-notification-settings/:id
	 */
	http.put('/api/mock/app-notification-settings/:id', async ({ params, request }) => {
		const api = mockApi('app_notification_settings');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	})
];

export default appNotificationSettingsApi;
