import { createContext } from 'react';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { DeepPartial } from 'react-hook-form';
import { CalendarEvent } from '../../api/types';

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export type EventDialogType = {
	type: 'new' | 'edit';
	props: {
		open: boolean;
		anchorPosition?: { top: number; left: number };
	};
	data?: DeepPartial<CalendarEvent> | null;
};

type CalendarAppContextType = {
	selectedLabels: string[];
	eventDialog: EventDialogType;
	setSelectedLabels: (labels: string[]) => void;
	toggleSelectedLabels: (label: string) => void;
	openNewEventDialog: (selectInfo: Partial<DateSelectArg>) => void;
	openEditEventDialog: (clickInfo: EventClickArg) => void;
	closeNewEventDialog: () => void;
	closeEditEventDialog: () => void;
};

export const CalendarAppContext = createContext<CalendarAppContextType | null>(null);
