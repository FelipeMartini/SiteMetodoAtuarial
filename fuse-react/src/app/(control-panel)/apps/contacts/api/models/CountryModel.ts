import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Country } from '../types';

/**
 * The country model.
 */
const CountryModel = (data: PartialDeep<Country>) =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		iso: '',
		name: '',
		code: '',
		flagImagePos: ''
	});

export default CountryModel;
