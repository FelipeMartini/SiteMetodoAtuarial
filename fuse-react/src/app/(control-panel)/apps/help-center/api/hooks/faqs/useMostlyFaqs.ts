import { useQuery } from '@tanstack/react-query';
import { helpCenterApi } from '../../services/helpCenterApiServices';

export const mostlyFaqsQueryKey = ['help-center', 'faqs', 'mostly'];

export const useMostlyFaqs = () => {
	return useQuery({
		queryFn: helpCenterApi.getMostlyFaqs,
		queryKey: mostlyFaqsQueryKey
	});
};
