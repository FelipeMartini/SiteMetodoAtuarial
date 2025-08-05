import { useQuery } from '@tanstack/react-query';
import { academyApi } from '../../services/academyApiService';

export const coursesQueryKey = ['academy', 'courses'];

export const useAcademyCourses = () => {
	return useQuery({
		queryKey: coursesQueryKey,
		queryFn: academyApi.getCourses
	});
};
