import { api } from '@/utils/api';
import type {
	SettingsAccount,
	SettingsNotifications,
	SettingsSecurity,
	SettingsPlanBilling,
	SettingsTeamMember
} from '../types';

export const settingsApiService = {
	getAccountSettings: () => api.get(`mock/app-account-settings/0`).json<SettingsAccount>(),

	updateAccountSettings: (data: SettingsAccount) => api.put(`mock/app-account-settings/0`, { json: data }).json(),

	getNotificationSettings: () => api.get(`mock/app-notification-settings/0`).json<SettingsNotifications>(),

	updateNotificationSettings: (data: SettingsNotifications) =>
		api.put(`mock/app-notification-settings/0`, { json: data }).json(),

	getSecuritySettings: () => api.get(`mock/app-security-settings/0`).json<SettingsSecurity>(),

	updateSecuritySettings: (data: SettingsSecurity) => api.put(`mock/app-security-settings/0`, { json: data }).json(),

	getPlanBillingSettings: () => api.get(`mock/app-plan-billing-settings/0`).json<SettingsPlanBilling>(),

	updatePlanBillingSettings: (data: SettingsPlanBilling) =>
		api.put(`mock/app-plan-billing-settings/0`, { json: data }).json(),

	getTeamMembers: () => api.get(`mock/app-team-members`).json<SettingsTeamMember[]>(),

	createTeamMember: (data: SettingsTeamMember) => api.post(`mock/app-team-members`, { json: data }).json(),

	updateTeamMembers: (data: SettingsTeamMember[]) => api.put(`mock/app-team-members`, { json: data }).json(),

	deleteTeamMember: (memberId: string) => api.delete(`mock/app-team-members/${memberId}`).json()
};
