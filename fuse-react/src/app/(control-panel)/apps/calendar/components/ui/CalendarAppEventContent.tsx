import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { EventContentArg } from '@fullcalendar/core';
import { useLabels } from '../../api/hooks/labels/useLabels';

type CalendarAppEventContentProps = {
	eventInfo: EventContentArg & { event: Event };
};

/**
 * The event content for the calendar app.
 */
function CalendarAppEventContent(props: CalendarAppEventContentProps) {
	const { eventInfo } = props;
	const theme = useTheme();

	const { data: labels } = useLabels();
	const labelId = eventInfo.event.extendedProps.label as string;
	const label = _.find(labels, { id: labelId });

	return (
		<Box
			sx={{
				backgroundColor: label?.color,
				color: label && theme.palette.getContrastText(label?.color)
			}}
			className={clsx('flex h-5.5 w-full items-center rounded-sm px-2 py-0.5 text-white')}
		>
			<Typography className="text-md font-semibold">{eventInfo.timeText}</Typography>
			<Typography className="text-md truncate px-1">{eventInfo.event.title}</Typography>
		</Box>
	);
}

export default CalendarAppEventContent;
