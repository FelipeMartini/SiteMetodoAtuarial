import Divider from '@mui/material/Divider';
import { Draggable } from '@hello-pangea/dnd';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ListItemButton from '@mui/material/ListItemButton';
import { ListItemText } from '@mui/material';
import clsx from 'clsx';
import useNavigate from '@fuse/hooks/useNavigate';
import { Task } from '../../api/types';

type SectionListItemProps = {
	data: Task;
	isFiltered: boolean;
};

/**
 * The section list item.
 */
function SectionListItem(props: SectionListItemProps) {
	const { data, isFiltered } = props;
	const navigate = useNavigate();

	return (
		<Draggable
			draggableId={data.id}
			index={data.order}
		>
			{(provided) => (
				<>
					<ListItemButton
						className="group px-10 py-3"
						sx={{ bgcolor: 'background.default' }}
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
						<ListItemText
							classes={{
								root: 'm-0',
								primary: clsx('font-semibold text-lg truncate', data.completed && 'line-through')
							}}
							primary={data.title}
						/>
					</ListItemButton>
					<Divider />
				</>
			)}
		</Draggable>
	);
}

export default SectionListItem;
