import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const aiImageGeneratorApi = [
	/**
	 * GET api/mock/ai-image-generator/presets
	 */
	http.get('/api/mock/ai-image-generator/presets', async ({ request }) => {
		const api = mockApi('ai_image_generator_presets');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/ai-image-generator/presets
	 */
	http.post('/api/mock/ai-image-generator/presets', async ({ request }) => {
		const api = mockApi('ai_image_generator_presets');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * DELETE api/mock/ai-image-generator/presets/:id
	 */
	http.delete('/api/mock/ai-image-generator/presets/:id', async ({ params }) => {
		const api = mockApi('ai_image_generator_presets');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/ai-image-generator/items
	 */
	http.get('/api/mock/ai-image-generator/items', async ({ request }) => {
		const api = mockApi('ai_image_generator_items');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * POST api/mock/ai-image-generator/items
	 */
	http.post('/api/mock/ai-image-generator/items', async ({ request }) => {
		const api = mockApi('ai_image_generator_items');
		const data = (await request.json()) as Record<string, unknown>;
		const newItem = await api.create(data);
		return HttpResponse.json(newItem, { status: 201 });
	}),

	/**
	 * GET api/mock/ai-image-generator/items/:id
	 */
	http.get('/api/mock/ai-image-generator/items/:id', async ({ params }) => {
		const api = mockApi('ai_image_generator_items');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/ai-image-generator/items/:id
	 */
	http.put('/api/mock/ai-image-generator/items/:id', async ({ params, request }) => {
		const api = mockApi('ai_image_generator_items');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/ai-image-generator/items/:id
	 */
	http.delete('/api/mock/ai-image-generator/items/:id', async ({ params }) => {
		const api = mockApi('ai_image_generator_items');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	})
];

export default aiImageGeneratorApi;
