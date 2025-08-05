import { setupWorker } from 'msw/browser';
import usersApi from './api/usersApi';
import profileApi from './api/profileApi';
import uiIconsApi from './api/uiIconsApi';
import projectDashboardApi from './api/projectDashboardApi';
import cryptoDashboardApi from './api/cryptoDashboardApi';
import financeDashboardApi from './api/financeDashboardApi';
import analyticsDashboardApi from './api/analyticsDashboardApi';
import calendarApi from './api/calendarApi';
import mailboxApi from './api/mailboxApi';
import notificationsApi from './api/notificationsApi';
import scrumboardApi from './api/scrumboardApi';
import notesApi from './api/notesApi';
import helpCenterApi from './api/helpCenterApi';
import fileManagerApi from './api/fileManagerApi';
import ecommerceApi from './api/ecommerceApi';
import academyApi from './api/academyApi';
import messengerApi from './api/messengerApi';
import appAccountSettingsApi from './api/appAccountSettingsApi';
import appNotificationSettingsApi from './api/appNotificationSettingsApi';
import appSecuritySettingsApi from './api/appSecuritySettingsApi';
import appPlanBillingSettingsApi from './api/appPlanBillingSettingsApi';
import appTeamMembersApi from './api/appTeamMembersApi';
import tasksApi from './api/tasksApi';
import contactsApi from './api/contactsApi';
import countriesApi from './api/countriesApi';
import authApi from './api/authApi';
import aiImageGeneratorApi from './api/aiImageGeneratorApi';

// This configures a Service Worker with the given request handlers.
export const worker = setupWorker(
	...[
		...authApi,
		...usersApi,
		...profileApi,
		...uiIconsApi,
		...projectDashboardApi,
		...cryptoDashboardApi,
		...financeDashboardApi,
		...analyticsDashboardApi,
		...calendarApi,
		...mailboxApi,
		...notificationsApi,
		...scrumboardApi,
		...notesApi,
		...helpCenterApi,
		...fileManagerApi,
		...ecommerceApi,
		...academyApi,
		...messengerApi,
		...appAccountSettingsApi,
		...appNotificationSettingsApi,
		...appSecuritySettingsApi,
		...appPlanBillingSettingsApi,
		...appTeamMembersApi,
		...tasksApi,
		...contactsApi,
		...countriesApi,
		...aiImageGeneratorApi
	]
);
