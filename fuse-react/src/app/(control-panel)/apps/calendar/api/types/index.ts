import { Dictionary } from '@fullcalendar/core/internal';

export type CalendarEvent = {
	id?: string;
	title?: string;
	allDay?: boolean;
	start?: string;
	end?: string;
	extendedProps?: Dictionary;
};

export type CalendarLabel = {
	id: string;
	title: string;
	color: string;
};
