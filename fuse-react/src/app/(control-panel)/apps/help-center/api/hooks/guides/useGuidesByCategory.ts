import { useQuery } from '@tanstack/react-query';
import { helpCenterApi } from '../../services/helpCenterApiServices';

export const guidesByCategoryQueryKey = (categoryId: string) => ['help-center', 'guides', 'category', categoryId];

export const useGuidesByCategory = (categoryId: string) => {
	return useQuery({
		queryFn: () => helpCenterApi.getGuidesByCategory(categoryId),
		queryKey: guidesByCategoryQueryKey(categoryId),
		enabled: !!categoryId
	});
};
