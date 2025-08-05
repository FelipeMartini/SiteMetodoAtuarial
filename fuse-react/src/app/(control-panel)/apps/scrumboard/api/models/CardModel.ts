import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { ScrumboardCard } from '../types';

/**
 * The card model.
 */
function CardModel(data: PartialDeep<ScrumboardCard>): ScrumboardCard {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		boardId: '',
		listId: '',
		title: '',
		description: '',
		labels: [],
		dueDate: 0,
		attachmentCoverId: '',
		memberIds: [],
		attachments: [],
		subscribed: false,
		checklists: [],
		activities: []
	});
}

export default CardModel;
