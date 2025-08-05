import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Order } from '../../types';

export const orderQueryKey = (orderId: string) => ['ecommerce', 'order', orderId];

export const useOrder = (orderId: string) => {
	return useQuery<Order>({
		queryKey: orderQueryKey(orderId),
		queryFn: () => ecommerceApi.getOrder(orderId),
		enabled: !!orderId
	});
};
