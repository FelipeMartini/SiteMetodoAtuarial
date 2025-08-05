import { api } from '@/utils/api';
import { Order, Product } from '../types';

export const ecommerceApi = {
	// Products
	getProducts: async (): Promise<Product[]> => {
		return api.get('mock/ecommerce/products').json();
	},

	getProduct: async (productId: string): Promise<Product> => {
		return api.get(`mock/ecommerce/products/${productId}`).json();
	},

	createProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
		return api
			.post('mock/ecommerce/products', {
				json: product
			})
			.json();
	},

	updateProduct: async (product: Product): Promise<Product> => {
		return api
			.put(`mock/ecommerce/products/${product.id}`, {
				json: product
			})
			.json();
	},

	deleteProduct: async (productId: string) => {
		return api.delete(`mock/ecommerce/products/${productId}`);
	},

	deleteProducts: async (productIds: string[]) => {
		return api.delete('mock/ecommerce/products', {
			json: productIds
		});
	},

	// Orders
	getOrders: async (): Promise<Order[]> => {
		return api.get('mock/ecommerce/orders').json();
	},

	getOrder: async (orderId: string): Promise<Order> => {
		return api.get(`mock/ecommerce/orders/${orderId}`).json();
	},

	updateOrder: async (order: Order): Promise<Order> => {
		return api
			.put(`mock/ecommerce/orders/${order.id}`, {
				json: order
			})
			.json();
	},

	deleteOrder: async (orderId: string) => {
		return api.delete(`mock/ecommerce/orders/${orderId}`);
	},

	deleteOrders: async (orderIds: string[]) => {
		return api.delete('mock/ecommerce/orders', {
			json: orderIds
		});
	}
};
