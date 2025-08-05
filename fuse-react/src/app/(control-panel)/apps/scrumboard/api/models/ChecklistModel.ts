import FuseUtils from '@fuse/utils';
import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { ScrumboardChecklist } from '../types';

/**
 * The checklist model.
 */
function ChecklistModel(data: PartialDeep<ScrumboardChecklist>): ScrumboardChecklist {
	data = data || {};

	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		name: '',
		checkItems: []
	});
}

export default ChecklistModel;
