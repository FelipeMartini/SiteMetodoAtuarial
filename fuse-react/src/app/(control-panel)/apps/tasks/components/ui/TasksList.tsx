import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { DragDropContext, Droppable, DroppableProvided, DropResult } from '@hello-pangea/dnd';
import FuseLoading from '@fuse/core/FuseLoading';
import TaskListItem from './TaskListItem';
import SectionListItem from './SectionListItem';
import { Task } from '../../api/types';
import { useReorderTasks } from '../../api/hooks/tasks/useReorderTasks';

/**
 * The tasks list.
 */
function TasksList() {
	const { tasks, reorder, isLoading, isFiltered } = useReorderTasks();

	if (isLoading && !tasks.length) {
		return <FuseLoading />;
	}

	if (!tasks?.length) {
		return (
			<div className="flex h-full flex-1 items-center justify-center">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no tasks!
				</Typography>
			</div>
		);
	}

	function onDragEnd(result: DropResult) {
		const { source, destination } = result;

		if (isFiltered || !destination || destination.index === source.index) {
			return;
		}

		reorder({
			startIndex: source.index,
			endIndex: destination.index
		});
	}

	return (
		<List className="m-0 w-full border-x-1 p-0">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable
					droppableId="list"
					type="list"
					direction="vertical"
				>
					{(provided: DroppableProvided) => (
						<>
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{tasks.map((item, index) => {
									if (item.type === 'task') {
										return (
											<TaskListItem
												isFiltered={isFiltered}
												key={item.id}
												data={{ ...item, order: index } as Task}
											/>
										);
									}

									if (item.type === 'section') {
										return (
											<SectionListItem
												isFiltered={isFiltered}
												key={item.id}
												data={{ ...item, order: index } as Task}
											/>
										);
									}

									return null;
								})}
							</div>
							{provided.placeholder}
						</>
					)}
				</Droppable>
			</DragDropContext>
		</List>
	);
}

export default TasksList;
