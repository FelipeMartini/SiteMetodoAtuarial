import FuseUtils from '@fuse/utils';
import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { ScrumboardCheckListItem } from '../types';

/**
 * The checklist item model.
 */
function ChecklistItemModel(data: PartialDeep<ScrumboardCheckListItem>): ScrumboardCheckListItem {
	data = data || {};

	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		name: '',
		checked: false
	});
}

export default ChecklistItemModel;
