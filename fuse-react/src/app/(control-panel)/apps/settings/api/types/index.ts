export type SettingsAccount = {
	id?: string;
	name?: string;
	username?: string;
	title?: string;
	company?: string;
	about?: string;
	email?: string;
	phone?: string;
	country?: string;
	language?: string;
};

export type SettingsNotifications = {
	id: string;
	communication?: boolean;
	security?: boolean;
	meetups?: boolean;
	comments?: boolean;
	mention?: boolean;
	follow?: boolean;
	inquiry?: boolean;
};

export type SettingsSecurity = {
	id: string;
	currentPassword?: string;
	newPassword?: string;
	twoStepVerification?: boolean;
	askPasswordChange?: boolean;
};

export type SettingsPlanBilling = {
	id: string;
	plan?: string;
	cardHolder?: string;
	cardNumber?: string;
	cardExpiration?: string;
	cardCVC?: string;
	country?: string;
	zip?: string;
};

export type SettingsTeamMember = {
	id: string;
	avatar?: string;
	name?: string;
	email?: string;
	role?: string;
};
