import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const profileApi = [
	/**
	 * GET api/mock/profile/albums
	 */
	http.get('/api/mock/profile/albums', async ({ request }) => {
		const api = mockApi('profile_albums');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/profile/media-items
	 */
	http.get('/api/mock/profile/media-items', async ({ request }) => {
		const api = mockApi('profile_media_items');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/profile/activities
	 */
	http.get('/api/mock/profile/activities', async ({ request }) => {
		const api = mockApi('profile_activities');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/profile/posts
	 */
	http.get('/api/mock/profile/posts', async ({ request }) => {
		const api = mockApi('profile_posts');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/profile/about
	 */
	http.get('/api/mock/profile/about', async ({ request }) => {
		const api = mockApi('profile_about');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default profileApi;
