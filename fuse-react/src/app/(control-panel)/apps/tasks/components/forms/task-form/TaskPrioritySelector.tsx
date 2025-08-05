import { ForwardedRef, MouseEvent, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import _ from 'lodash';
import clsx from 'clsx';

type priorityListType = {
	value: number;
	title: string;
	icon: string;
	textColor: string;
	bgColor: string;
};

/**
 * The priority list data.
 */
const priorityList: priorityListType[] = [
	{
		value: 0,
		title: 'Low',
		icon: 'lucide:arrow-down',
		textColor: 'rgb(76 175 80)',
		bgColor: 'rgba(76,175,80,0.3)'
	},
	{
		value: 1,
		title: 'Normal',
		icon: 'lucide:minus',
		textColor: 'rgb(80,80,80)',
		bgColor: 'rgba(80,80,80, 0.3)'
	},
	{
		value: 2,
		title: 'High',
		icon: 'lucide:arrow-up',
		textColor: 'rgb(244 67 54)',
		bgColor: 'rgba(244,67,54,0.3)'
	}
];

type TaskPrioritySelectorProps = {
	value: number;
	onChange: (val: number) => void;
	className?: string;
	ref: ForwardedRef<HTMLButtonElement>;
};

/**
 * The task priority selector.
 */
function TaskPrioritySelector(props: TaskPrioritySelectorProps) {
	const { value = 0, onChange, className, ref } = props;

	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const selectedOption = _.find(priorityList, { value });

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleSelect = (val: number) => {
		onChange(val);
		handleClose();
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				ref={ref}
				id="priority-button"
				aria-controls="priority-menu"
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
				className={clsx('min-w-24 px-3', className)}
				sx={{ color: selectedOption.textColor, backgroundColor: selectedOption.bgColor }}
			>
				<FuseSvgIcon
					className="mx-1"
					size={16}
				>
					{selectedOption.icon}
				</FuseSvgIcon>
				<span>{selectedOption.title}</span>
			</Button>
			<Menu
				id="priority-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					'aria-labelledby': 'priority-button'
				}}
			>
				{priorityList.map((item) => (
					<MenuItem
						onClick={() => handleSelect(item.value)}
						key={item.value}
					>
						<ListItemText primary={item.title} />
						<ListItemIcon
							className="min-w-9 justify-end"
							sx={{ color: item.textColor }}
						>
							<FuseSvgIcon>{item.icon}</FuseSvgIcon>
						</ListItemIcon>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default TaskPrioritySelector;
