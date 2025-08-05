import { useQuery } from '@tanstack/react-query';
import { ecommerceApi } from '../../services/ecommerceApiService';
import { Product } from '../../types';

export const productsQueryKey = ['ecommerce', 'products'];

export const useProducts = () => {
	return useQuery<Product[]>({
		queryFn: ecommerceApi.getProducts,
		queryKey: productsQueryKey
	});
};
