import { useQuery } from '@tanstack/react-query';
import { helpCenterApi } from '../../services/helpCenterApiServices';

export const guideQueryKey = (guideId: string) => ['help-center', 'guide', guideId];

export const useGuide = (guideId: string) => {
	return useQuery({
		queryFn: () => helpCenterApi.getGuideById(guideId),
		queryKey: guideQueryKey(guideId),
		enabled: !!guideId
	});
};
