import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../../services/calendarApiService';
import { labelsQueryKey } from './useLabels';
import { useSnackbar } from 'notistack';

export const useCreateLabel = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: calendarApi.createLabel,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: labelsQueryKey });
		},
		onError: () => {
			enqueueSnackbar('Error creating label!', {
				variant: 'error'
			});
		}
	});
};
