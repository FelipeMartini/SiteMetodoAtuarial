import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MouseEvent, useMemo, useState } from 'react';
import _ from 'lodash';
import useNavigate from '@fuse/hooks/useNavigate';
import { useUpdateMailboxMails } from '../../../api/hooks/mails/useUpdateMailboxMails';
import { useMailboxFolders } from '../../../api/hooks/folders/useMailboxFolders';
import { useMailboxMail } from '../../../api/hooks/mails/useMailboxMail';

type MailActionsMenuProps = {
	className?: string;
};

/**
 * The mail actions menu.
 */
function MailActionsMenu(props: MailActionsMenuProps) {
	const { className } = props;
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const { mutate: updateMails } = useUpdateMailboxMails();

	const { data: mail } = useMailboxMail();

	const { data: folders } = useMailboxFolders();
	const spamFolderId = useMemo(() => _.find(folders, { slug: 'spam' })?.id, [folders]);
	const trashFolderId = useMemo(() => _.find(folders, { slug: 'trash' })?.id, [folders]);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	if (!mail) {
		return null;
	}

	return (
		<div className={className}>
			<IconButton
				id="basic-button"
				aria-controls="basic-menu"
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
			</IconButton>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'basic-button'
				}}
			>
				<MenuItem
					onClick={() => {
						updateMails([{ id: mail.id, unread: true }]);
						handleClose();
					}}
				>
					<ListItemIcon className="min-w-9">
						<FuseSvgIcon>lucide:mail</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText primary="Mark as unread" />
				</MenuItem>

				<MenuItem
					onClick={() => {
						updateMails([{ id: mail.id, folder: spamFolderId }]);
						handleClose();
					}}
				>
					<ListItemIcon className="min-w-9">
						<FuseSvgIcon>lucide:triangle-alert</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText primary="Spam" />
				</MenuItem>

				<MenuItem
					onClick={() => {
						updateMails([{ id: mail.id, folder: trashFolderId }]);
						navigate(-1);
						handleClose();
					}}
				>
					<ListItemIcon className="min-w-9">
						<FuseSvgIcon>lucide:trash</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText primary="Delete" />
				</MenuItem>
			</Menu>
		</div>
	);
}

export default MailActionsMenu;
