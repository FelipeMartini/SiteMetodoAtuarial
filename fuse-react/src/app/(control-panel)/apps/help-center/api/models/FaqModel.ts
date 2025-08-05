import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Faq } from '../types';

/**
 * Creates a new faq object with the specified data.
 */
const FaqModel = (data: PartialDeep<Faq>) =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		categoryId: '',
		question: '',
		answer: ''
	});

export default FaqModel;
