import { http, HttpResponse } from 'msw';
import mockApi from '../mockApi';

const ecommerceApi = [
	/**
	 * GET api/mock/ecommerce/products
	 */
	http.get('/api/mock/ecommerce/products', async ({ request }) => {
		const api = mockApi('ecommerce_products');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * DELETE api/mock/ecommerce/products
	 */
	http.delete('/api/mock/ecommerce/products', async ({ request }) => {
		const api = mockApi('ecommerce_products');
		const data = (await request.json()) as string[];
		const result = await api.delete(data);
		return HttpResponse.json({ success: result.success });
	}),

	/**
	 * GET api/mock/ecommerce/products/:id
	 */
	http.get('/api/mock/ecommerce/products/:id', async ({ params }) => {
		const api = mockApi('ecommerce_products');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/ecommerce/products/:id
	 */
	http.put('/api/mock/ecommerce/products/:id', async ({ params, request }) => {
		const api = mockApi('ecommerce_products');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/ecommerce/products/:id
	 */
	http.delete('/api/mock/ecommerce/products/:id', async ({ params }) => {
		const api = mockApi('ecommerce_products');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	}),

	/**
	 * GET api/mock/ecommerce/orders
	 */
	http.get('/api/mock/ecommerce/orders', async ({ request }) => {
		const api = mockApi('ecommerce_orders');
		const queryParams = Object.fromEntries(new URL(request.url).searchParams);
		const items = await api.findAll(queryParams);
		return HttpResponse.json(items);
	}),

	/**
	 * DELETE api/mock/ecommerce/orders
	 */
	http.delete('/api/mock/ecommerce/orders', async ({ request }) => {
		const api = mockApi('ecommerce_orders');
		const data = (await request.json()) as string[];
		const result = await api.delete(data);
		return HttpResponse.json({ success: result.success });
	}),

	/**
	 * GET api/mock/ecommerce/orders/:id
	 */
	http.get('/api/mock/ecommerce/orders/:id', async ({ params }) => {
		const api = mockApi('ecommerce_orders');
		const { id } = params as Record<string, string>;
		const item = await api.find(id);

		if (!item) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(item);
	}),

	/**
	 * PUT api/mock/ecommerce/orders/:id
	 */
	http.put('/api/mock/ecommerce/orders/:id', async ({ params, request }) => {
		const api = mockApi('ecommerce_orders');
		const { id } = params as Record<string, string>;
		const data = (await request.json()) as Record<string, unknown>;
		const updatedItem = await api.update(id, data);

		if (!updatedItem) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json(updatedItem);
	}),

	/**
	 * DELETE api/mock/ecommerce/orders/:id
	 */
	http.delete('/api/mock/ecommerce/orders/:id', async ({ params }) => {
		const api = mockApi('ecommerce_orders');
		const { id } = params as Record<string, string>;
		const result = await api.delete([id]);

		if (!result.success) {
			return HttpResponse.json({ message: 'Item not found' }, { status: 404 });
		}

		return HttpResponse.json({ message: 'Deleted successfully' });
	})
];

export default ecommerceApi;
