import { api } from '@/utils/api';
import type { Notification } from '../types';

export const notificationsApiService = {
	getAll: async (): Promise<Notification[]> => {
		return api.get('mock/notifications').json();
	},

	create: async (notification: Notification): Promise<Notification> => {
		return api
			.post('mock/notifications', {
				json: notification
			})
			.json();
	},

	deleteMany: async (notificationIds: string[]): Promise<void> => {
		await api.delete('mock/notifications', {
			json: notificationIds
		});
	},

	getById: async (notificationId: string): Promise<Notification> => {
		return api.get(`mock/notifications/${notificationId}`).json();
	},

	delete: async (notificationId: string): Promise<void> => {
		await api.delete(`mock/notifications/${notificationId}`);
	}
};
