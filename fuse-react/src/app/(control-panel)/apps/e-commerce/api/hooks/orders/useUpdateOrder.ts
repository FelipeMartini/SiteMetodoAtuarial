import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { ordersQueryKey } from './useOrders';
import { orderQueryKey } from './useOrder';

export const useUpdateOrder = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateOrder,
		onSuccess: (_, order) => {
			queryClient.invalidateQueries({ queryKey: ordersQueryKey });
			queryClient.invalidateQueries({ queryKey: orderQueryKey(order.id) });
		}
	});
};
