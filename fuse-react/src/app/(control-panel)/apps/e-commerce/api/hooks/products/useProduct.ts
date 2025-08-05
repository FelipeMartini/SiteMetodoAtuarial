import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Product } from '../../types';

export const productQueryKey = (productId: string) => ['ecommerce', 'product', productId];

export const useProduct = (productId: string) => {
	return useQuery<Product>({
		queryFn: () => ecommerceApi.getProduct(productId),
		queryKey: productQueryKey(productId),
		enabled: !!productId
	});
};
