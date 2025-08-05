import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { ordersQueryKey } from './useOrders';
import { orderQueryKey } from './useOrder';

export const useDeleteOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteOrder,
		onSuccess: (_, orderId) => {
			queryClient.invalidateQueries({ queryKey: ordersQueryKey });
			queryClient.invalidateQueries({ queryKey: orderQueryKey(orderId) });
		}
	});
};
