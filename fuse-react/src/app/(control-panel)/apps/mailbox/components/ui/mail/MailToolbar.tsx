import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Tooltip from '@mui/material/Tooltip';
import useNavigate from '@fuse/hooks/useNavigate';
import MailActionsMenu from './MailActionsMenu';
import MailLabelsMenu from './MailLabelsMenu';
import { useUpdateMailboxMails } from '../../../api/hooks/mails/useUpdateMailboxMails';
import { useMailboxMail } from '../../../api/hooks/mails/useMailboxMail';

/**
 * The mail toolbar.
 */
function MailToolbar() {
	const { data: mail } = useMailboxMail();

	const { mutate: updateMails } = useUpdateMailboxMails();

	const theme = useTheme();
	const navigate = useNavigate();

	function handleGoBack() {
		navigate(-1);
	}

	if (!mail) {
		return null;
	}

	return (
		<Box className="flex min-h-16 w-full items-center justify-between border-b px-2">
			<IconButton
				onClick={handleGoBack}
				className="md:-mx-1 lg:hidden"
			>
				<FuseSvgIcon>{theme.direction === 'ltr' ? 'lucide:arrow-left' : 'lucide:arrow-right'}</FuseSvgIcon>
			</IconButton>

			<div className="flex flex-1 items-center justify-end">
				<MailLabelsMenu
					labels={mail.labels}
					onChange={(value) => {
						updateMails([{ id: mail.id, labels: value }]);
					}}
					className="mx-0.5"
				/>

				<Tooltip title="Set important">
					<IconButton
						className="mx-0.5"
						onClick={() => {
							updateMails([{ id: mail.id, important: !mail.important }]);
						}}
					>
						<FuseSvgIcon className={clsx(mail.important && 'text-red-600 dark:text-red-500')}>
							lucide:circle-alert
						</FuseSvgIcon>
					</IconButton>
				</Tooltip>

				<Tooltip title="Set starred">
					<IconButton
						className="mx-0.5"
						onClick={() => {
							updateMails([{ id: mail.id, starred: !mail.starred }]);
						}}
					>
						<FuseSvgIcon className={clsx(mail.starred && 'text-orange-500 dark:text-red-400')}>
							lucide:star
						</FuseSvgIcon>
					</IconButton>
				</Tooltip>

				<MailActionsMenu className="mx-1" />
			</div>
		</Box>
	);
}

export default MailToolbar;
