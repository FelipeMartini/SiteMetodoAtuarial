import { useQuery } from '@tanstack/react-query';
import { helpCenterApi } from '../../services/helpCenterApiServices';

export const faqCategoriesQueryKey = ['help-center', 'faq-categories'];

export const useFaqCategories = () => {
	return useQuery({
		queryFn: helpCenterApi.getFaqCategories,
		queryKey: faqCategoriesQueryKey
	});
};
