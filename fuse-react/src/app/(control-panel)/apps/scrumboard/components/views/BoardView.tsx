'use client';

import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { styled } from '@mui/material/styles';
import BoardAddList from '../ui/board/board-list/BoardAddList';
import BoardList from '../ui/board/board-list/BoardList';
import BoardCardDialog from '../ui/board/card/BoardCardDialog';
import BoardHeader from '../ui/board/BoardHeader';
import useParams from '@fuse/hooks/useParams';
import { useScrumboardReorder } from '../../api/hooks/order/useScrumboardReorder';
import { useSnackbar } from 'notistack';

const Root = styled(FusePageSimple)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	},
	'& .FusePageSimple-header': {}
}));

/**
 * The board component.
 */
function BoardView() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const routeParams = useParams<{ boardId: string }>();
	const { boardId } = routeParams;
	const { enqueueSnackbar } = useSnackbar();

	const { reorderList, reorderCard, board } = useScrumboardReorder(boardId);

	function onDragEnd(result: DropResult) {
		const { source, destination } = result;

		// dropped nowhere
		if (!destination) {
			return;
		}

		// did not move anywhere - can bail early
		if (source.droppableId === destination.droppableId && source.index === destination.index) {
			return;
		}

		// reordering list
		if (result.type === 'list') {
			reorderList(result);
			enqueueSnackbar('List Order Saved', {
				variant: 'success'
			});
		}

		// reordering card
		if (result.type === 'card') {
			reorderCard(result);
			enqueueSnackbar('Card Order Saved', {
				variant: 'success'
			});
		}
	}

	if (!board) {
		return null;
	}

	return (
		<>
			<Root
				header={<BoardHeader />}
				content={
					board?.lists ? (
						<div className="flex h-full flex-1 overflow-x-auto overflow-y-hidden">
							<DragDropContext onDragEnd={onDragEnd}>
								<Droppable
									droppableId="list"
									type="list"
									direction="horizontal"
								>
									{(provided) => (
										<div
											ref={provided.innerRef}
											className="flex px-2 py-4 md:px-3 md:py-6"
										>
											{board?.lists.map((list, index) => (
												<BoardList
													boardId={board.id}
													key={list.id}
													listId={list.id}
													cardIds={list.cards}
													index={index}
												/>
											))}

											{provided.placeholder}

											<BoardAddList />
										</div>
									)}
								</Droppable>
							</DragDropContext>
						</div>
					) : null
				}
				scroll={isMobile ? 'page' : 'content'}
			/>
			<BoardCardDialog />
		</>
	);
}

export default BoardView;
