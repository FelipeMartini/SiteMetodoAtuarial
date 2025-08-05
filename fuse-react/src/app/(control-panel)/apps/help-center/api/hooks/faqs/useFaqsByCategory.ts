import { useQuery } from '@tanstack/react-query';
import { helpCenterApi } from '../../services/helpCenterApiServices';

export const faqsByCategoryQueryKey = (categoryId: string) => ['help-center', 'faqs', 'category', categoryId];

export const useFaqsByCategory = (categoryId: string) => {
	return useQuery({
		queryFn: () => helpCenterApi.getFaqsByCategory(categoryId),
		queryKey: faqsByCategoryQueryKey(categoryId),
		enabled: !!categoryId
	});
};
