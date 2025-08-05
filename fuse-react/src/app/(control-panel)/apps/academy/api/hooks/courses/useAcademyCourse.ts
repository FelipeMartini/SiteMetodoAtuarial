import { useQuery } from '@tanstack/react-query';
import { academyApi } from '../../services/academyApiService';

export const courseQueryKey = (courseId: string) => ['academy', 'course', courseId];

export const useAcademyCourse = (courseId: string) => {
	return useQuery({
		queryKey: courseQueryKey(courseId),
		queryFn: () => academyApi.getCourse(courseId)
	});
};
