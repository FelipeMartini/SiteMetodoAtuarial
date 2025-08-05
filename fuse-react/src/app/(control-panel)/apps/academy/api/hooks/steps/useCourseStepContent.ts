import { useQuery } from '@tanstack/react-query';
import { academyApi } from '../../services/academyApiService';

export const courseStepContentQueryKey = ['academy', 'course', 'step', 'content'];

export const useCourseStepContent = (stepId: string) => {
	return useQuery({
		queryFn: () => academyApi.getCourseStepContent('0'), // demo
		// queryFn: () => academyApi.getCourseStepContent(stepId)
		queryKey: [...courseStepContentQueryKey, stepId]
	});
};
