import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Tag } from '../types';

/**
 * The tag model.
 */
const TagModel = (data: PartialDeep<Tag>): Tag =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		title: ''
	}) as Tag;

export default TagModel;
