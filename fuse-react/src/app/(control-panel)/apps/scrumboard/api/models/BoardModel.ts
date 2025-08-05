import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { ScrumboardBoard, ScrumboardCard } from '../types';

export type CardIdsType = ScrumboardCard['id'][];

/**
 * The board model.
 */
function BoardModel(data?: PartialDeep<ScrumboardBoard>): ScrumboardBoard {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		title: 'Untitled Board',
		description: '',
		icon: 'lucide:layout-grid',
		lastActivity: new Date(),
		members: [],
		settings: {
			subscribed: true,
			cardCoverImages: true
		},
		lists: [],
		labels: []
	});
}

export default BoardModel;
