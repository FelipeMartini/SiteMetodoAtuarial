import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { FaqCategory } from '../types';

/**
 * Creates a new faq category object with the specified data.
 */
const FaqCategoryModel = (data: PartialDeep<FaqCategory>) =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		slug: '',
		title: ''
	});

export default FaqCategoryModel;
