'use client';
import { styled } from '@mui/material/styles';
import { useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import {
	DateSelectArg,
	DatesSetArg,
	EventAddArg,
	EventChangeArg,
	EventClickArg,
	EventContentArg,
	EventDropArg,
	EventRemoveArg
} from '@fullcalendar/core';
import FuseLoading from '@fuse/core/FuseLoading';
import CalendarHeader from '../ui/CalendarHeader';
import EventDialog from '../dialogs/event/EventDialog';
import CalendarAppSidebar from '../ui/CalendarAppSidebar';
import CalendarAppEventContent from '../ui/CalendarAppEventContent';
import { useEvents } from '../../api/hooks/events/useEvents';
import { useUpdateEvent } from '../../api/hooks/events/useUpdateEvent';
import { CalendarAppProvider } from '../../contexts/CalendarAppContext/CalendarAppProvider';
import Paper from '@mui/material/Paper';
import { useCalendarAppContext } from '../../contexts/CalendarAppContext/useCalendarAppContext';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& a': {
		color: `${theme.vars.palette.text.primary}!important`,
		textDecoration: 'none!important'
	},
	'& .fc-media-screen': {
		minHeight: '100%',
		width: '100%'
	},
	'& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
		borderColor: `${theme.vars.palette.divider}!important`
	},
	'&  .fc-scrollgrid-section > td': {
		border: 0
	},
	'& .fc-daygrid-day': {
		'&:last-child': {
			borderRight: 0
		}
	},
	'& .fc-col-header-cell': {
		borderLeftWidth: '0px!important',
		borderRightWidth: '0px!important',
		padding: '0.5rem 0 0 0',
		'& .fc-col-header-cell-cushion': {
			color: theme.vars.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			textTransform: 'uppercase'
		}
	},
	'& .fc-view ': {
		'& > .fc-scrollgrid': {
			border: '0!important'
		}
	},
	'& .fc-daygrid-day.fc-day-today': {
		backgroundColor: 'transparent!important',
		'& .fc-daygrid-day-number': {
			borderRadius: '100%',
			backgroundColor: `${theme.vars.palette.secondary.main}!important`,
			color: `${theme.vars.palette.secondary.contrastText}!important`
		}
	},
	'& .fc-daygrid-day-top': {
		justifyContent: 'center',
		'& .fc-daygrid-day-number': {
			color: theme.vars.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 26,
			height: 26,
			margin: '4px 0',
			borderRadius: '50%',
			float: 'none',
			lineHeight: 1
		}
	},
	'& .fc-h-event': {
		border: '0!important',
		background: 'initial'
	},
	'& .fc-event': {
		border: 0,
		padding: '0 ',
		fontSize: 12,
		margin: '0 6px 4px 6px!important'
	},
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2,
		paddingLeft: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2],
		borderRadius: '12px 0 0 0',
		backgroundColor: theme.vars.palette.background.paper,
		[theme.breakpoints.down('md')]: {
			borderRadius: '12px 12px 0 0'
		}
	},
	'& .FusePageSimple-sidebarWrapper': {
		border: 'none'
	},
	'& .FusePageSimple-sidebarContent': {
		backgroundColor: theme.vars.palette.background.default
	}
}));

/**
 * The calendar app.
 */
function CalendarAppView() {
	const [currentDate, setCurrentDate] = useState<DatesSetArg>();
	const { data, isLoading } = useEvents();
	const { mutate: updateEvent } = useUpdateEvent();
	const { selectedLabels, openNewEventDialog, openEditEventDialog } = useCalendarAppContext();

	const events = useMemo(
		() => data?.filter?.((item) => selectedLabels.includes(item?.extendedProps?.label as string)),
		[data, selectedLabels]
	);
	const calendarRef = useRef<FullCalendar>(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		// Correct calendar dimentions after sidebar toggles
		setTimeout(() => {
			calendarRef.current?.getApi()?.updateSize();
		}, 300);
	}, [leftSidebarOpen]);

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		openNewEventDialog(selectInfo);
	};

	const handleEventDrop = (eventDropInfo: EventDropArg): void => {
		const { id, title, allDay, start, end, extendedProps } = eventDropInfo.event;
		updateEvent({
			id,
			title,
			allDay,
			start: start?.toISOString() ?? '',
			end: end?.toISOString() ?? '',
			extendedProps
		});
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		clickInfo.jsEvent.preventDefault();
		openEditEventDialog(clickInfo);
	};

	const handleDates = (rangeInfo: DatesSetArg) => {
		setCurrentDate(rangeInfo);
	};

	const handleEventAdd = (addInfo: EventAddArg) => {
		// eslint-disable-next-line no-console
		console.info(addInfo);
	};

	const handleEventChange = (changeInfo: EventChangeArg) => {
		// eslint-disable-next-line no-console
		console.info(changeInfo);
	};

	const handleEventRemove = (removeInfo: EventRemoveArg) => {
		// eslint-disable-next-line no-console
		console.info(removeInfo);
	};

	function handleToggleLeftSidebar() {
		setLeftSidebarOpen(!leftSidebarOpen);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<>
			<Root
				content={
					<Paper className="flex min-h-0 flex-auto flex-col overflow-hidden">
						<CalendarHeader
							calendarRef={calendarRef}
							currentDate={currentDate}
							onToggleLeftSidebar={handleToggleLeftSidebar}
						/>
						<FullCalendar
							plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
							headerToolbar={false}
							initialView="dayGridMonth"
							editable
							selectable
							selectMirror
							dayMaxEvents
							weekends
							datesSet={handleDates}
							select={handleDateSelect}
							events={events}
							eventContent={(eventInfo: EventContentArg & { event: Event }) => (
								<CalendarAppEventContent eventInfo={eventInfo} />
							)}
							eventClick={handleEventClick}
							eventAdd={handleEventAdd}
							eventChange={handleEventChange}
							eventRemove={handleEventRemove}
							eventDrop={handleEventDrop}
							initialDate={new Date(2022, 3, 1)}
							ref={calendarRef}
							// longPressDelay={500} //if you want to use this for mobile - default is 1000
						/>
					</Paper>
				}
				leftSidebarProps={{
					content: <CalendarAppSidebar />,
					open: leftSidebarOpen,
					onClose: () => setLeftSidebarOpen(false),
					width: 256
				}}
				scroll="content"
			/>
			<EventDialog />
		</>
	);
}

const CalendarAppWrapper = () => {
	return (
		<CalendarAppProvider>
			<CalendarAppView />
		</CalendarAppProvider>
	);
};

export default CalendarAppWrapper;
