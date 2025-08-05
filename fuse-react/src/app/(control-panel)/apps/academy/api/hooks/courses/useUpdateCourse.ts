import { useMutation, useQueryClient } from '@tanstack/react-query';
import { academyApi } from '../../services/academyApiService';
import { Course } from '../../types';
import { useSnackbar } from 'notistack';
import { coursesQueryKey } from './useAcademyCourses';
import { courseQueryKey } from './useAcademyCourse';
export const useUpdateCourse = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: ({ courseId, data }: { courseId: string; data: Partial<Course> }) =>
			academyApi.updateCourse(courseId, data),
		onSuccess: (_, { courseId }) => {
			queryClient.invalidateQueries({ queryKey: coursesQueryKey });
			queryClient.invalidateQueries({ queryKey: courseQueryKey(courseId) });

			enqueueSnackbar('Course Saved', { variant: 'success' });
		},
		onError: () => {
			enqueueSnackbar('Error Saving the course!', { variant: 'error' });
		}
	});
};
