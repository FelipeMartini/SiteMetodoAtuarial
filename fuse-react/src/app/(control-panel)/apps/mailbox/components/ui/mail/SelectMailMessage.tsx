import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The select mail message.
 */
function SelectMailMessage() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center p-6">
			<FuseSvgIcon
				className="mb-4"
				color="disabled"
				size={24}
			>
				lucide:mail
			</FuseSvgIcon>
			<Typography
				className="mt-4 text-2xl font-semibold tracking-tight"
				color="text.secondary"
			>
				Select a mail to read
			</Typography>
		</div>
	);
}

export default SelectMailMessage;
