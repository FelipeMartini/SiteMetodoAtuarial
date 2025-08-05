import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { productsQueryKey } from './useProducts';
import { productQueryKey } from './useProduct';

export const useUpdateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.updateProduct,
		onSuccess: (_, product) => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
			queryClient.invalidateQueries({ queryKey: productQueryKey(product.id) });
		}
	});
};
