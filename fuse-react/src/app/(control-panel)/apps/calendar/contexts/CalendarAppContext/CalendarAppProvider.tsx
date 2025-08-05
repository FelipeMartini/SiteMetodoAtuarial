import { DateSelectArg, EventClickArg } from '@fullcalendar/core/index.js';
import { useCallback } from 'react';
import { CalendarAppContext, EventDialogType } from './CalendarAppContext';

import { useState } from 'react';
import { formatISO } from 'date-fns/formatISO';

const initialState = {
	selectedLabels: [],
	eventDialog: {
		type: 'new' as const,
		props: {
			open: false,
			anchorPosition: { top: 200, left: 400 }
		},
		data: null
	}
};

export function CalendarAppProvider({ children }: { children: React.ReactNode }) {
	const [selectedLabels, setSelectedLabels] = useState<string[]>(initialState.selectedLabels);
	const [eventDialog, setEventDialog] = useState<EventDialogType>(initialState.eventDialog);

	const toggleSelectedLabels = useCallback((label: string) => {
		setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
	}, []);

	const openNewEventDialog = useCallback((selectInfo: Partial<DateSelectArg>) => {
		const { start, end, jsEvent } = selectInfo;
		setEventDialog({
			type: 'new',
			props: {
				open: true,
				anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX }
			},
			data: {
				start: formatISO(start),
				end: formatISO(end)
			}
		});
	}, []);

	const openEditEventDialog = useCallback((clickInfo: EventClickArg) => {
		const { jsEvent, event } = clickInfo;
		const { id, title, allDay, start, end, extendedProps } = event;
		setEventDialog({
			type: 'edit',
			props: {
				open: true,
				anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX }
			},
			data: {
				id,
				title,
				allDay,
				extendedProps,
				start: formatISO(start),
				end: formatISO(end)
			}
		});
	}, []);

	const closeNewEventDialog = useCallback(() => {
		setEventDialog(initialState.eventDialog);
	}, []);

	const closeEditEventDialog = useCallback(() => {
		setEventDialog({
			...initialState.eventDialog,
			type: 'edit'
		});
	}, []);

	return (
		<CalendarAppContext.Provider
			value={{
				selectedLabels,
				eventDialog,
				setSelectedLabels,
				toggleSelectedLabels,
				openNewEventDialog,
				openEditEventDialog,
				closeNewEventDialog,
				closeEditEventDialog
			}}
		>
			{children}
		</CalendarAppContext.Provider>
	);
}
