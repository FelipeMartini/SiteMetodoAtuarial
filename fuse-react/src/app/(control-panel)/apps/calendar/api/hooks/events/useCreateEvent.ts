import { useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarApi } from '../../services/calendarApiService';
import { eventsQueryKey } from './useEvents';
import { useSnackbar } from 'notistack';

export const useCreateEvent = () => {
	const queryClient = useQueryClient();
	const { enqueueSnackbar } = useSnackbar();

	return useMutation({
		mutationFn: calendarApi.createEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: eventsQueryKey });
		},
		onError: () => {
			enqueueSnackbar('Error creating event!', {
				variant: 'error'
			});
		}
	});
};
