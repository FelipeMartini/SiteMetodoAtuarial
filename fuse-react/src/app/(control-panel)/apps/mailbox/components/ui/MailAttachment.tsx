import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { MailboxMailAttachment } from '../../api/types';
type MailAttachmentProps = {
	attachment: MailboxMailAttachment;
};

/**
 * The mail attachment.
 */
function MailAttachment(props: MailAttachmentProps) {
	const { attachment } = props;

	if (!attachment) {
		return null;
	}

	return (
		<div className="flex items-center rounded-md border-1 p-3">
			{attachment?.type.startsWith('image/') && (
				<img
					className="h-9 w-9 overflow-hidden rounded-md"
					src={`/assets/images/apps/mailbox/${attachment.preview}`}
					alt="attachment"
				/>
			)}

			{attachment.type.startsWith('application/') && (
				<Box
					sx={{ backgroundColor: 'background.default' }}
					className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-md"
				>
					<Typography className="flex items-center justify-center text-sm font-semibold">
						{attachment.type.split('/')[1].trim().toUpperCase()}
					</Typography>
				</Box>
			)}

			<div className="mx-3">
				<Typography className="text-md truncate font-medium">{attachment.name}</Typography>
				<Typography
					className="truncate text-sm font-medium"
					color="text.secondary"
				>
					{attachment.size / 1000} KB
				</Typography>
			</div>
		</div>
	);
}

export default MailAttachment;
