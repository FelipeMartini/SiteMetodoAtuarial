import { useQuery } from '@tanstack/react-query';
import { helpCenterApi } from '../../services/helpCenterApiServices';

export const guidesQueryKey = ['help-center', 'guides'];

export const useGuides = () => {
	return useQuery({
		queryFn: helpCenterApi.getGuides,
		queryKey: guidesQueryKey
	});
};
