import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const appTeamMembersApi = [
	/**
	 * GET api/mock/app-team-members
	 */
	http.get('/api/mock/app-team-members', async ({ request }) => {
		const api = mockApi('app_team_members');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/app-team-members
	 */
	http.post('/api/mock/app-team-members', async ({ request }) => {
		const api = mockApi('app_team_members');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * PUT api/mock/app-team-members
	 */
	http.put('/api/mock/app-team-members', async ({ request }) => {
		const api = mockApi('app_team_members');
		const data = (await request.json()) as { id: string }[];
		const result = await api.updateMany(data);
		return HttpResponse.json(result);
	}),

	/**
	 * DELETE api/mock/app-team-members/:id
	 */
	http.delete('/api/mock/app-team-members/:id', async ({ params }) => {
		const api = mockApi('app_team_members');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * PUT api/mock/app-team-members/:id
	 */
	http.put('/api/mock/app-team-members/:id', async ({ params, request }) => {
		const api = mockApi('app_team_members');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	})
];

export default appTeamMembersApi;
