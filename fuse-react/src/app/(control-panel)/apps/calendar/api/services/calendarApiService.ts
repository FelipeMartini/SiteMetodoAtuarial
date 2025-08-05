import { CalendarEvent, CalendarLabel } from '../types';
import { api } from '@/utils/api';

export const calendarApi = {
	getEvents: async (): Promise<CalendarEvent[]> => {
		return api.get('mock/calendar/events').json();
	},

	createEvent: async (event: CalendarEvent): Promise<CalendarEvent> => {
		return api
			.post('mock/calendar/events', {
				json: { Event: event }
			})
			.json();
	},

	updateEvent: async (event: CalendarEvent): Promise<CalendarEvent> => {
		return api
			.put(`mock/calendar/events/${event.id}`, {
				json: event
			})
			.json();
	},

	deleteEvent: async (id: string): Promise<void> => {
		await api.delete(`mock/calendar/events/${id}`);
	},

	getLabels: async (): Promise<CalendarLabel[]> => {
		return api.get('mock/calendar/labels').json();
	},

	createLabel: async (label: CalendarLabel): Promise<CalendarLabel> => {
		return api
			.post('mock/calendar/labels', {
				json: label
			})
			.json();
	},

	updateLabel: async (label: CalendarLabel): Promise<CalendarLabel> => {
		return api
			.put(`mock/calendar/labels/${label.id}`, {
				json: label
			})
			.json();
	},

	deleteLabel: async (id: string): Promise<void> => {
		await api.delete(`mock/calendar/labels/${id}`);
	}
};
