import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { CalendarLabel } from '../types';

/**
 * The label model.
 */
function LabelModel(data?: PartialDeep<CalendarLabel>) {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		title: '',
		color: '#e75931'
	});
}

export default LabelModel;
