import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns/format';
import { fromUnixTime } from 'date-fns/fromUnixTime';
import { MouseEvent, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ScrumboardAttachment, ScrumboardCard } from '../../../../../api/types';

type CardAttachmentProps = {
	item: ScrumboardAttachment;
	card: ScrumboardCard;
	makeCover: (id: string) => void;
	removeCover: () => void;
	removeAttachment: (id: string) => void;
};

/**
 * The card attachment component.
 */
function CardAttachment(props: CardAttachmentProps) {
	const { item, card, makeCover, removeCover, removeAttachment } = props;

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	function handleMenuOpen(event: MouseEvent<HTMLButtonElement>) {
		setAnchorEl(event.currentTarget);
	}

	function handleMenuClose() {
		setAnchorEl(null);
	}

	switch (item.type) {
		case 'image': {
			return (
				<div
					className="mb-4 flex w-full px-4 sm:w-1/2"
					key={item.id}
				>
					<div className="flex h-32 w-32 min-w-32 items-center justify-center">
						<Paper className="overflow-hidden shadow-sm">
							<img
								className="block max-h-full"
								src={item.src}
								alt="attachment"
							/>
						</Paper>
					</div>
					<div className="flex min-w-0 flex-auto flex-col items-start justify-center px-4">
						<div className="flex w-full items-center">
							<Typography className="shrink truncate text-lg font-semibold">{item.name}</Typography>
							{card.attachmentCoverId === item.id && (
								<FuseSvgIcon
									className="mx-1 text-orange-300"
									size={20}
								>
									lucide:start
								</FuseSvgIcon>
							)}
						</div>
						<Typography
							className="mb-3 w-full truncate"
							color="text.secondary"
						>
							{format(fromUnixTime(item.time), 'Pp')}
						</Typography>
						<Button
							aria-haspopup="true"
							onClick={handleMenuOpen}
							variant="outlined"
							size="small"
							endIcon={<FuseSvgIcon>lucide:chevron-down</FuseSvgIcon>}
						>
							Actions
						</Button>
						<Menu
							id="actions-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							{card.attachmentCoverId !== item?.id ? (
								<MenuItem
									onClick={() => {
										handleMenuClose();
										makeCover(item?.id);
									}}
								>
									Make Cover
								</MenuItem>
							) : (
								<MenuItem
									onClick={() => {
										handleMenuClose();
										removeCover();
									}}
								>
									Remove Cover
								</MenuItem>
							)}
							<MenuItem
								onClick={() => {
									handleMenuClose();
									removeAttachment(item.id);
								}}
							>
								Remove Attachment
							</MenuItem>
						</Menu>
					</div>
				</div>
			);
		}
		case 'link': {
			return (
				<div
					className="mb-4 flex w-full px-4 sm:w-1/2"
					key={item.id}
				>
					<Paper className="flex h-32 w-32 min-w-32 items-center justify-center overflow-hidden rounded-sm shadow-sm">
						<Typography className="font-semibold">LINK</Typography>
					</Paper>
					<div className="flex min-w-0 flex-auto flex-col items-start justify-center px-4">
						<Typography className="w-full truncate text-lg font-semibold">{item.url}</Typography>
						<Typography
							className="mb-3 w-full truncate"
							color="text.secondary"
						>
							{item.time}
						</Typography>
						<Button
							aria-haspopup="true"
							onClick={handleMenuOpen}
							variant="outlined"
							size="small"
							endIcon={<FuseSvgIcon>lucide:chevron-down</FuseSvgIcon>}
						>
							Actions
						</Button>
						<Menu
							id="simple-menu"
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleMenuClose}
						>
							<MenuItem
								onClick={() => {
									handleMenuClose();
									removeAttachment(item.id);
								}}
							>
								Remove Attachment
							</MenuItem>
						</Menu>
					</div>
				</div>
			);
		}
		default: {
			return null;
		}
	}
}

export default CardAttachment;
