import FuseUtils from '@fuse/utils';
import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { getUnixTime } from 'date-fns/getUnixTime';
import { ScrumboardComment } from '../types';

/**
 * The comment model.
 */
function CommentModel(data: PartialDeep<ScrumboardComment>): ScrumboardComment {
	data = data || {};

	return _.defaults(data, {
		id: FuseUtils.generateGUID(),
		type: 'comment',
		idMember: null,
		message: '',
		time: getUnixTime(new Date())
	});
}

export default CommentModel;
