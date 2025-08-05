import { useQuery } from '@tanstack/react-query';
import { helpCenterApi } from '../../services/helpCenterApiServices';

export const guideCategoriesQueryKey = ['help-center', 'guide-categories'];

export const useGuideCategories = () => {
	return useQuery({
		queryFn: helpCenterApi.getGuideCategories,
		queryKey: guideCategoriesQueryKey
	});
};
