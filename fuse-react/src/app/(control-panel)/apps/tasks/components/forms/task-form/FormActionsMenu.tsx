import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState, MouseEvent } from 'react';
import useNavigate from '@fuse/hooks/useNavigate';
import { useDeleteTask } from '../../../api/hooks/tasks/useDeleteTask';

type FormActionsMenuProps = {
	taskId: string;
};

/**
 * The form actions menu.
 */
function FormActionsMenu(props: FormActionsMenuProps) {
	const { taskId } = props;
	const navigate = useNavigate();
	const { mutate: removeTask } = useDeleteTask();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	function handleRemoveTask() {
		removeTask(taskId, {
			onSuccess: () => {
				navigate('/apps/tasks');
			}
		});
	}

	return (
		<div>
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
				<MenuItem onClick={handleRemoveTask}>
					<ListItemIcon className="min-w-9">
						<FuseSvgIcon>lucide:trash</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText primary="Delete" />
				</MenuItem>
			</Menu>
		</div>
	);
}

export default FormActionsMenu;
