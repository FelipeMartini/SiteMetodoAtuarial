import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '../../services/calendarApiService';

export const eventsQueryKey = ['calendar', 'events'];

export const useEvents = () => {
	return useQuery({
		queryFn: calendarApi.getEvents,
		queryKey: eventsQueryKey
	});
};
