import { useQuery } from '@tanstack/react-query';
import { academyApi } from '../../services/academyApiService';

export const courseStepsQueryKey = ['academy', 'course', 'steps'];

export const useCourseSteps = (courseId: string) => {
	return useQuery({
		queryKey: [...courseStepsQueryKey, courseId],
		// queryFn: () => academyApi.getCourseSteps(courseId)
		queryFn: () => academyApi.getCourseSteps('0') // demo
	});
};
