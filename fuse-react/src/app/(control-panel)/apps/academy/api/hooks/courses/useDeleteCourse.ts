import { useMutation, useQueryClient } from '@tanstack/react-query';
import { academyApi } from '../../services/academyApiService';
import { coursesQueryKey } from './useAcademyCourses';

export const useDeleteCourse = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (courseId: string) => academyApi.deleteCourse(courseId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: coursesQueryKey });
		}
	});
};
