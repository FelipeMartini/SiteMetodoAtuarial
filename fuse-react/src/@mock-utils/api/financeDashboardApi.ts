import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const financeDashboardApi = [
	/**
	 * GET api/mock/finance-dashboard/widgets
	 */
	http.get('/api/mock/finance-dashboard/widgets', async ({ request }) => {
		const api = mockApi('finance_dashboard_widgets');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default financeDashboardApi;
