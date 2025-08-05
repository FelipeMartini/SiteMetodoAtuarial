import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { productsQueryKey } from './useProducts';

export const useDeleteProducts = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteProducts,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
		}
	});
};
