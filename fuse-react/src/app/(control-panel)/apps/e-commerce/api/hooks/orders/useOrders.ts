import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Order } from '../../types';

export const ordersQueryKey = ['ecommerce', 'orders'];

export const useOrders = () => {
	return useQuery<Order[]>({
		queryFn: ecommerceApi.getOrders,
		queryKey: ordersQueryKey
	});
};
