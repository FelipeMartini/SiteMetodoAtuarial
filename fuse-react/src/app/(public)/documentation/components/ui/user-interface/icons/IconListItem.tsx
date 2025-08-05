import { useState, useCallback, memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';

type IconItemProps = PaperProps & {
	icon: string;
	iconSet: string;
	onIconSelect: (icon: string) => void;
	size: number;
};

function IconListItem(props: IconItemProps) {
	const { icon, iconSet, onIconSelect, size, ...rest } = props;
	const [open, setOpen] = useState(false);

	const handleCopy = useCallback((copyText: string) => {
		navigator.clipboard.writeText(copyText);

		setOpen(true);
		setTimeout(() => {
			setOpen(false);
		}, 1000);
	}, []);

	const handleSelect = useCallback(() => {
		onIconSelect(icon);

		const iconText = `${iconSet}:${icon}`;

		handleCopy(iconText);
	}, [handleCopy, icon, iconSet, onIconSelect]);

	return (
		<Tooltip
			open={open}
			title="Copied!"
			slotProps={{ popper: { placement: 'top' } }}
			arrow
		>
			<Paper
				className="flex min-h-0 cursor-pointer flex-col items-center rounded-sm border-2 px-2 py-4"
				elevation={0}
				onClick={handleSelect}
				{...rest}
			>
				<div className="my-4 flex items-center justify-center">
					<FuseSvgIcon
						className="text-7xl"
						size={size}
						color="action"
					>
						{`${iconSet}:${icon}`}
					</FuseSvgIcon>
				</div>
				<Typography
					className="m-0 text-center text-sm break-all"
					color="text.secondary"
				>
					{`${iconSet}:${icon}`}
				</Typography>
			</Paper>
		</Tooltip>
	);
}

export default memo(IconListItem);
