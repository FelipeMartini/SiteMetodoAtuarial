import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../../services/calendarApiService';
import { eventsQueryKey } from './useEvents';
import { useSnackbar } from 'notistack';

export const useDeleteEvent = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: calendarApi.deleteEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: eventsQueryKey });
		},
		onError: () => {
			enqueueSnackbar('Error deleting event!', {
				variant: 'error'
			});
		}
	});
};
