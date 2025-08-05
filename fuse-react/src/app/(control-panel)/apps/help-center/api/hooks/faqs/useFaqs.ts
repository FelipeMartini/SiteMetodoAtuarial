import { useQuery } from '@tanstack/react-query';
import { helpCenterApi } from '../../services/helpCenterApiServices';

export const faqsQueryKey = ['help-center', 'faqs'];

export const useFaqs = () => {
	return useQuery({
		queryFn: helpCenterApi.getFaqs,
		queryKey: faqsQueryKey
	});
};
