import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { productsQueryKey } from './useProducts';
export const useCreateProduct = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ecommerceApi.createProduct,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: productsQueryKey });
		}
	});
};
