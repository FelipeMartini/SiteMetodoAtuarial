import _ from 'lodash';
import { DropResult } from '@hello-pangea/dnd';
import { ScrumboardBoardList } from '../../api/types';

// a little function to help us with reordering the result
const reorder = (list: unknown[], startIndex: number, endIndex: number) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

export default reorder;

/**
 * Reorder Quote Map
 */
export const reorderQuoteMap = (
	lists: ScrumboardBoardList[],
	source: DropResult['source'],
	destination: DropResult['destination']
) => {
	const current = _.find(lists, { id: source.droppableId });
	const next = _.find(lists, { id: destination?.droppableId });
	const target = current.cards[source.index];

	// moving to same list
	if (source.droppableId === destination?.droppableId) {
		const reordered = reorder(current.cards, source.index, destination.index) as string[];
		return lists.map((list) => {
			if (list.id === source.droppableId) {
				list.cards = reordered;
			}

			return list;
		});
	}

	// moving to different list

	// remove from original
	current.cards.splice(source.index, 1);

	// insert into next
	next.cards.splice(destination?.index, 0, target);

	return lists.map((list) => {
		if (list.id === source.droppableId) {
			return current;
		}

		if (list.id === destination?.droppableId) {
			return next;
		}

		return list;
	});
};
