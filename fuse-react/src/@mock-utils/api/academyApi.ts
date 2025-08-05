import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const academyApi = [
	/**
	 * GET api/mock/academy/courses
	 */
	http.get('/api/mock/academy/courses', async ({ request }) => {
		const api = mockApi('academy_courses');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/academy/courses/:id
	 */
	http.get('/api/mock/academy/courses/:id', async ({ params }) => {
		const api = mockApi('academy_courses');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/academy/courses/:id
	 */
	http.put('/api/mock/academy/courses/:id', async ({ params, request }) => {
		const api = mockApi('academy_courses');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/academy/courses/:id
	 */
	http.delete('/api/mock/academy/courses/:id', async ({ params }) => {
		const api = mockApi('academy_courses');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/academy/course-steps
	 */
	http.get('/api/mock/academy/course-steps', async ({ request }) => {
		const api = mockApi('academy_course_steps');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/academy/course-step-contents
	 */
	http.get('/api/mock/academy/course-step-contents', async ({ request }) => {
		const api = mockApi('academy_course_step_contents');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * GET api/mock/academy/course-step-contents/:id
	 */
	http.get('/api/mock/academy/course-step-contents/:id', async ({ params }) => {
		const api = mockApi('academy_course_step_contents');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * GET api/mock/academy/categories
	 */
	http.get('/api/mock/academy/categories', async ({ request }) => {
		const api = mockApi('academy_categories');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	})
];

export default academyApi;
