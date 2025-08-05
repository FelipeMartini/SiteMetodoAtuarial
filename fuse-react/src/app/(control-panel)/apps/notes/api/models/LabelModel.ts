import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { NotesLabel } from '../types';

/**
 * The label model.
 */
function LabelModel(data: PartialDeep<NotesLabel>) {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		title: ''
	});
}

export default LabelModel;
