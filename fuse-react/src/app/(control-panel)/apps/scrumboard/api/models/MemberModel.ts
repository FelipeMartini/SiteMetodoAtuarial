import FuseUtils from '@fuse/utils';
import _ from 'lodash';
import { ScrumboardMember } from '../types';

/**
 * The Member model.
 */
function MemberModel(data: Partial<ScrumboardMember>): ScrumboardMember {
	data = data || {};

	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		name: '',
		avatar: '',
		class: ''
	});
}

export default MemberModel;
