import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FullCalendar from '@fullcalendar/react';
import { DatesSetArg } from '@fullcalendar/core';
import { RefObject } from 'react';
import { useMainTheme } from '@fuse/core/FuseSettings/hooks/fuseThemeHooks';
import CalendarViewMenu from './CalendarViewMenu';
import { useCalendarAppContext } from '../../contexts/CalendarAppContext/useCalendarAppContext';

type CalendarHeaderProps = {
	calendarRef: RefObject<FullCalendar | null>;
	currentDate: DatesSetArg;
	onToggleLeftSidebar: () => void;
};

/**
 * The calendar header.
 */
function CalendarHeader(props: CalendarHeaderProps) {
	const { calendarRef, currentDate, onToggleLeftSidebar } = props;
	const { openNewEventDialog } = useCalendarAppContext();
	const mainTheme = useMainTheme();
	const calendarApi = () => calendarRef.current.getApi();

	function handleViewChange(viewType: string) {
		calendarApi().changeView(viewType);
	}

	return (
		<div className="z-10 container flex w-full justify-between p-3 pb-5">
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-2">
					<IconButton
						onClick={() => onToggleLeftSidebar()}
						aria-label="open left sidebar"
						className="rounded-lg ring-1 ring-gray-300 dark:bg-gray-900 dark:ring-gray-800"
					>
						<FuseSvgIcon>lucide:menu</FuseSvgIcon>
					</IconButton>

					<Typography className="hidden px-2 text-2xl font-semibold tracking-tight whitespace-nowrap sm:flex">
						{currentDate?.view.title}
					</Typography>
				</div>

				<div className="flex items-center gap-2">
					<Tooltip title="Previous">
						<IconButton
							aria-label="Previous"
							onClick={() => calendarApi().prev()}
							className="rounded-lg ring-1 ring-gray-300 dark:bg-gray-900 dark:ring-gray-800"
						>
							<FuseSvgIcon>
								{mainTheme.direction === 'ltr' ? 'lucide:chevron-left' : 'lucide:chevron-right'}
							</FuseSvgIcon>
						</IconButton>
					</Tooltip>
					<Tooltip title="Next">
						<IconButton
							aria-label="Next"
							onClick={() => calendarApi().next()}
							className="rounded-lg ring-1 ring-gray-300 dark:bg-gray-900 dark:ring-gray-800"
						>
							<FuseSvgIcon>
								{mainTheme.direction === 'ltr' ? 'lucide:chevron-right' : 'lucide:chevron-left'}
							</FuseSvgIcon>
						</IconButton>
					</Tooltip>

					<Tooltip title="Today">
						<div>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { delay: 0.3 } }}
							>
								<IconButton
									aria-label="today"
									onClick={() => calendarApi().today()}
									className="rounded-lg ring-1 ring-gray-300 dark:bg-gray-900 dark:ring-gray-800"
								>
									<FuseSvgIcon>lucide:calendar</FuseSvgIcon>
								</IconButton>
							</motion.div>
						</div>
					</Tooltip>
				</div>
			</div>

			<motion.div
				className="flex items-center justify-end gap-2 md:justify-center"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.3 } }}
			>
				<IconButton
					className="rounded-lg ring-1 ring-gray-300 dark:bg-gray-900 dark:ring-gray-800"
					size="small"
					aria-label="add"
					onClick={(ev) =>
						openNewEventDialog({
							jsEvent: ev.nativeEvent,
							start: new Date(),
							end: new Date()
						})
					}
				>
					<FuseSvgIcon>lucide:calendar-plus</FuseSvgIcon>
				</IconButton>

				<CalendarViewMenu
					currentDate={currentDate}
					onChange={handleViewChange}
				/>
			</motion.div>
		</div>
	);
}

export default CalendarHeader;
