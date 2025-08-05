import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const analyticsDashboardApi = [
	/**
	 * GET api/mock/analytics-dashboard/widgets
	 */
	http.get('/api/mock/analytics-dashboard/widgets', async ({ request }) => {
		const api = mockApi('analytics_dashboard_widgets');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default analyticsDashboardApi;
