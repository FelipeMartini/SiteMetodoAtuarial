import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../../services/calendarApiService';
import { labelsQueryKey } from './useLabels';
import { useSnackbar } from 'notistack';

export const useUpdateLabel = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: calendarApi.updateLabel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: labelsQueryKey });
		},
		onError: () => {
			enqueueSnackbar('Error updating label!', {
				variant: 'error'
			});
		}
	});
};
