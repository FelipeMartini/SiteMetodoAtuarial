import FuseUtils from '@fuse/utils';
import _ from 'lodash';
import { ScrumboardLabel } from '../types';

/**
 * The label model.
 */
function LabelModel(data: Partial<ScrumboardLabel>): ScrumboardLabel {
	data = data || {};
	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		boardId: '',
		title: ''
	});
}

export default LabelModel;
