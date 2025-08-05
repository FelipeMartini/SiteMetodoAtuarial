import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const cryptoDashboardApi = [
	/**
	 * GET api/mock/crypto-dashboard/widgets
	 */
	http.get('/api/mock/crypto-dashboard/widgets', async ({ request }) => {
		const api = mockApi('crypto_dashboard_widgets');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default cryptoDashboardApi;
