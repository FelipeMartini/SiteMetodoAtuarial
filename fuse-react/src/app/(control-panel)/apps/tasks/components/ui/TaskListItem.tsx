import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import { IconButton, ListItemButton, ListItemText } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns/format';
import Typography from '@mui/material/Typography';
import { Draggable } from '@hello-pangea/dnd';
import clsx from 'clsx';
import useNavigate from '@fuse/hooks/useNavigate';
import { Task } from '../../api/types';
import { useUpdateTask } from '../../api/hooks/tasks/useUpdateTask';

type TaskListItemProps = {
	data: Task;
	isFiltered: boolean;
};

/**
 * The task list item.
 */
function TaskListItem(props: TaskListItemProps) {
	const { data, isFiltered } = props;
	const { mutate: updateTask } = useUpdateTask();
	const navigate = useNavigate();

	return (
		<Draggable
			draggableId={data.id}
			index={data.order}
		>
			{(provided, snapshot) => (
				<>
					<ListItemButton
						className={clsx(snapshot.isDragging ? 'shadow-lg' : 'shadow-sm', 'group px-10 py-3')}
						sx={{ bgcolor: 'background.paper' }}
						ref={provided.innerRef}
						{...provided.draggableProps}
						onClick={() => {
							navigate(`/apps/tasks/${data.id}`);
						}}
					>
						<div
							className={clsx(
								'absolute inset-y-0 left-0 flex w-8 cursor-move items-center justify-center md:hidden md:group-hover:flex',
								isFiltered && '!hidden'
							)}
							{...provided.dragHandleProps}
						>
							<FuseSvgIcon
								sx={{ color: 'text.disabled' }}
								size={20}
							>
								lucide:menu
							</FuseSvgIcon>
						</div>
						<ListItemIcon className="mr-2 -ml-2.5 min-w-9">
							<IconButton
								sx={{ color: data.completed ? 'secondary.main' : 'text.disabled' }}
								onClick={(ev) => {
									ev.preventDefault();
									ev.stopPropagation();
									updateTask({ taskId: data.id, task: { completed: !data.completed } });
								}}
							>
								<FuseSvgIcon>lucide:circle-check</FuseSvgIcon>
							</IconButton>
						</ListItemIcon>
						<ListItemText
							classes={{ root: 'm-0', primary: clsx('truncate', data.completed && 'line-through') }}
							primary={data.title}
						/>
						<div className="flex items-center">
							<div>
								{data.priority === 0 && (
									<FuseSvgIcon className="icon-size-4 mx-3 text-green-500">
										lucide:arrow-down
									</FuseSvgIcon>
								)}
								{data.priority === 2 && (
									<FuseSvgIcon className="icon-size-4 mx-3 text-red-500">lucide:arrow-up</FuseSvgIcon>
								)}
							</div>

							{data.dueDate && (
								<Typography
									className="text-md whitespace-nowrap"
									color="text.secondary"
								>
									{format(new Date(data.dueDate), 'LLL dd')}
								</Typography>
							)}
						</div>
					</ListItemButton>
					<Divider />
				</>
			)}
		</Draggable>
	);
}

export default TaskListItem;
