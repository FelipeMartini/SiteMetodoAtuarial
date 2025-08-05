import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { ordersQueryKey } from './useOrders';

export const useDeleteOrders = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteOrders,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ordersQueryKey });
		}
	});
};
