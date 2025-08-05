import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Contact, ContactEmail, ContactPhoneNumber } from '../types';

/**
 * The contact phone number model.
 */
export const ContactPhoneModel = (data: PartialDeep<ContactPhoneNumber> | null): ContactPhoneNumber =>
	_.defaults(data || {}, {
		country: '',
		phoneNumber: '',
		label: ''
	});

/**
 * The contact email model.
 */
export const ContactEmailModel = (data: PartialDeep<ContactEmail> | null): ContactEmail =>
	_.defaults(data || {}, {
		email: '',
		label: ''
	});

/**
 * The contact model.
 */
const ContactModel = (data: PartialDeep<Contact>): Contact =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		avatar: '',
		background: '',
		name: '',
		emails: [],
		phoneNumbers: [],
		title: '',
		company: '',
		birthday: '',
		address: '',
		notes: '',
		tags: []
	});

export default ContactModel;
