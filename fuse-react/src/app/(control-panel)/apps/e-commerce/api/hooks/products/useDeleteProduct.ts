import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { productQueryKey } from './useProduct';
import { productsQueryKey } from './useProducts';

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.deleteProduct,
		onSuccess: (_, productId) => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
			queryClient.invalidateQueries({ queryKey: productQueryKey(productId) });
		}
	});
};
