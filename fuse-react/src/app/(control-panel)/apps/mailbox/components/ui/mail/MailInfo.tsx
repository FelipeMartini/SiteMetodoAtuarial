import * as React from 'react';
import Menu from '@mui/material/Menu';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns/format';
import { MouseEvent } from 'react';
import { useMailboxMail } from '../../../api/hooks/mails/useMailboxMail';

type MailInfoProps = {
	className?: string;
};

/**
 * The mail info.
 */
function MailInfo(props: MailInfoProps) {
	const { className } = props;

	const { data: mail } = useMailboxMail();

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

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
				size="small"
				className=""
				id="info-button"
				aria-controls="info-menu"
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<FuseSvgIcon size={18}>lucide:chevron-down</FuseSvgIcon>
			</IconButton>
			<Menu
				id="info-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'info-button'
				}}
				classes={{ list: 'p-4' }}
			>
				<div className="flex">
					<Typography className="text-md min-w-14 text-right font-medium">from:</Typography>
					<Typography className="text-md pl-2 whitespace-pre-wrap">{mail.from.contact}</Typography>
				</div>

				<div className="flex">
					<Typography className="text-md min-w-14 text-right font-medium">to:</Typography>
					<Typography className="text-md pl-2 whitespace-pre-wrap">{mail.to}</Typography>
				</div>

				{mail.cc && (
					<div className="flex">
						<Typography className="text-md min-w-14 text-right font-medium">cc:</Typography>
						<Typography className="text-md pl-2 whitespace-pre-wrap">{mail.cc.join(',\n')}</Typography>
					</div>
				)}

				{mail.bcc && (
					<div className="flex">
						<Typography className="text-md min-w-14 text-right font-medium">bcc:</Typography>
						<Typography className="text-md pl-2 whitespace-pre-wrap">{mail.bcc.join(',\n')}</Typography>
					</div>
				)}

				<div className="flex">
					<Typography className="text-md min-w-14 text-right font-medium">date:</Typography>
					<Typography className="text-md pl-2 whitespace-pre-wrap">
						{format(new Date(mail.date), 'EEEE, MMMM d, y - hh:mm a')}
					</Typography>
				</div>
				<div className="flex">
					<Typography className="text-md min-w-14 text-right font-medium">subject:</Typography>
					<Typography className="text-md pl-2 whitespace-pre-wrap">{mail.subject}</Typography>
				</div>
			</Menu>
		</div>
	);
}

export default MailInfo;
