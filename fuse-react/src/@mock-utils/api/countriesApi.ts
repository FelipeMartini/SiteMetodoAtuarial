import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const countriesApi = [
	/**
	 * GET api/mock/countries
	 */
	http.get('/api/mock/countries', async ({ request }) => {
		const api = mockApi('countries');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default countriesApi;
