import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../../services/calendarApiService';
import { eventsQueryKey } from './useEvents';
import { useSnackbar } from 'notistack';

export const useUpdateEvent = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();
	return useMutation({
		mutationFn: calendarApi.updateEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: eventsQueryKey });
		},
		onError: () => {
			enqueueSnackbar('Error updating event!', {
				variant: 'error'
			});
		}
	});
};
