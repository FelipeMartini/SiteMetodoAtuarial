import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Profile } from '../types';

/**
 * User model.
 */
function UserModel(data?: PartialDeep<Profile>) {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		name: '',
		email: '',
		status: '',
		avatar: '',
		about: ''
	});
}

export default UserModel;
