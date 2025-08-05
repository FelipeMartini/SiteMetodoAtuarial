import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Guide } from '../types';

/**
 * Creates a new guide object with the specified data.
 */
const GuideModel = (data: PartialDeep<Guide>) =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		categoryId: '',
		slug: '',
		title: '',
		subtitle: '',
		content: ''
	});

export default GuideModel;
