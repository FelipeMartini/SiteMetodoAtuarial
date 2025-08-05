import { useQuery } from '@tanstack/react-query';
import { calendarApi } from '../../services/calendarApiService';
import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useCalendarAppContext } from '../../../contexts/CalendarAppContext/useCalendarAppContext';

export const labelsQueryKey = ['calendar', 'labels'];

export const useLabels = () => {
	const { setSelectedLabels } = useCalendarAppContext();
	const { enqueueSnackbar } = useSnackbar();

	const query = useQuery({
		queryFn: calendarApi.getLabels,
		queryKey: labelsQueryKey
	});

	const { data: labels } = query;

	useEffect(() => {
		if (labels) {
			setSelectedLabels(labels.map((item) => item.id));
		}
	}, [labels, setSelectedLabels]);

	if (query.isError) {
		enqueueSnackbar('Error loading Labels!', {
			variant: 'error'
		});
	}

	return query;
};
