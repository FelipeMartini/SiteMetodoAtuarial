import { motion } from 'motion/react';
import { Checkbox, FormLabel } from '@mui/material';
import Typography from '@mui/material/Typography';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import LabelsDialog from '../dialogs/labels/LabelsDialog';
import { useLabels } from '../../api/hooks/labels/useLabels';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useCalendarAppContext } from '../../contexts/CalendarAppContext/useCalendarAppContext';

/**
 * The calendar app sidebar.
 */
function CalendarAppSidebar() {
	const { selectedLabels, toggleSelectedLabels } = useCalendarAppContext();
	const { data: labels } = useLabels();

	return (
		<div className="flex min-h-full flex-auto flex-col px-4 py-2">
			<PageBreadcrumb className="mb-2" />

			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
				className="mb-4 text-3xl font-semibold tracking-tight"
			>
				Calendar
			</motion.span>

			<div className="group flex items-center justify-between">
				<Typography
					className="text-lg leading-none font-semibold"
					color="secondary.main"
				>
					Labels
				</Typography>

				<LabelsDialog />
			</div>

			{labels?.map((label) => (
				<FormLabel
					htmlFor={label.id}
					key={label.id}
					className="group mt-2 flex h-6 w-full cursor-pointer items-center gap-2"
				>
					<Checkbox
						id={label.id}
						color="secondary"
						className="p-0"
						checked={selectedLabels.includes(label.id)}
						onChange={() => {
							toggleSelectedLabels(label.id);
						}}
					/>

					<FuseSvgIcon sx={{ color: label.color }}>lucide:tag</FuseSvgIcon>

					<Typography className="flex flex-1 leading-none">{label.title}</Typography>
				</FormLabel>
			))}
		</div>
	);
}

export default CalendarAppSidebar;
