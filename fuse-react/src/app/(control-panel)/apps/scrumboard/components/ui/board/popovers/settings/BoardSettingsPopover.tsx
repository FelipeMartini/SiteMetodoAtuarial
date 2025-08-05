import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button } from '@mui/material';
import Popover from '@mui/material/Popover';
import React from 'react';
import BoardSettingsForm from './BoardSettingsForm';

function BoardSettingsPopover() {
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover' : undefined;

	return (
		<>
			<Button
				className="whitespace-nowrap"
				variant="contained"
				color="secondary"
				aria-describedby={id}
				onClick={handleClick}
				startIcon={<FuseSvgIcon>lucide:settings</FuseSvgIcon>}
			>
				Settings
			</Button>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'right'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right'
				}}
				classes={{
					paper: 'max-w-xs w-full '
				}}
			>
				<BoardSettingsForm onClose={handleClose} />
			</Popover>
		</>
	);
}

export default BoardSettingsPopover;
