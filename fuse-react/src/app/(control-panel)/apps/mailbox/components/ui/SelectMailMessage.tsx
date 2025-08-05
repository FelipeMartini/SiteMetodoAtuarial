import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The select mail message.
 */
function SelectMailMessage() {
	return (
		<div className="flex flex-1 items-center justify-center gap-3 p-6">
			<FuseSvgIcon size={40}>lucide:mailbox</FuseSvgIcon>
			<Typography
				className="text-2xl font-semibold tracking-tight"
				color="text.secondary"
			>
				Select a mail to read
			</Typography>
		</div>
	);
}

export default SelectMailMessage;
