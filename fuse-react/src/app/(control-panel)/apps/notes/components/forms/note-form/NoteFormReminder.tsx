import { useState, useRef } from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { NotesNote } from '../../../api/types';

type NoteFormReminderProps = {
	reminder: NotesNote['reminder'];
	onChange: (T: NotesNote['reminder']) => void;
};

/**
 * The note form reminder.
 */
function NoteFormReminder(props: NoteFormReminderProps) {
	const { reminder, onChange } = props;
	const [open, setOpen] = useState(false);
	const buttonRef = useRef(null);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<Tooltip title="Set Reminder">
				<IconButton
					className="p-0"
					size="small"
					onClick={handleOpen}
					ref={buttonRef}
				>
					<FuseSvgIcon>lucide:bell</FuseSvgIcon>
				</IconButton>
			</Tooltip>

			<DateTimePicker
				disablePast
				value={reminder ? new Date(reminder) : null}
				onChange={(val) => {
					onChange(val?.toISOString() || '');
					handleClose();
				}}
				open={open}
				onClose={handleClose}
				slotProps={{
					textField: {
						className: 'hidden'
					},
					actionBar: {
						actions: ['clear', 'today']
					},
					popper: {
						anchorEl: () => buttonRef.current as HTMLButtonElement
					}
				}}
			/>
		</>
	);
}

export default NoteFormReminder;
