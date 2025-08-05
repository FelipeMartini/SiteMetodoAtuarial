import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { GuideCategory } from '../types';

/**
 * Creates a new guide category object with the specified data.
 */
const GuideCategoryModel = (data: PartialDeep<GuideCategory>) =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		slug: '',
		title: ''
	});

export default GuideCategoryModel;
