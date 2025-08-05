import { useQuery } from '@tanstack/react-query';
import { notesApiService } from '../../services/notesApiService';

export const reminderNotesQueryKey = ['notes', 'reminders'] as const;

export const useReminderNotes = () => {
	return useQuery({
		queryFn: notesApiService.getReminderNotes,
		queryKey: reminderNotesQueryKey
	});
};
