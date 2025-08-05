import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const projectDashboardApi = [
	/**
	 * GET api/mock/project-dashboard/widgets
	 */
	http.get('/api/mock/project-dashboard/widgets', async ({ request }) => {
		const api = mockApi('project_dashboard_widgets');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/project-dashboard/projects
	 */
	http.get('/api/mock/project-dashboard/projects', async ({ request }) => {
		const api = mockApi('project_dashboard_projects');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default projectDashboardApi;
