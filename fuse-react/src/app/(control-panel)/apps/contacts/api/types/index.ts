export type ContactPhoneNumber = {
	country: string;
	phoneNumber: string;
	label?: string;
};

export type ContactEmail = {
	email: string;
	label?: string;
};

export type Contact = {
	id: string;
	avatar?: string;
	background?: string;
	name: string;
	emails?: ContactEmail[];
	phoneNumbers?: ContactPhoneNumber[];
	title?: string;
	company?: string;
	birthday?: string;
	address?: string;
	notes?: string;
	tags?: string[];
};

export type Tag = {
	id: string;
	title: string;
};

export type Country = {
	id?: string;
	title?: string;
	iso?: string;
	code?: string;
	flagImagePos?: string;
};

export type GroupedContacts = {
	group: string;
	children?: Contact[];
};

export type AccumulatorType = Record<string, GroupedContacts>;
