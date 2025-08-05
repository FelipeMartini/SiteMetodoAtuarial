import { api } from '@/utils/api';
import type { NotesNote, NotesLabel, RouteParams } from '../types';

export const notesApiService = {
	getNotesList: async ({ filter, id }: RouteParams = {}): Promise<NotesNote[]> => {
		let params = {};

		if (filter === 'labels') {
			params = { labels: id };
		} else if (filter === 'archive') {
			params = { archived: true };
		} else if (filter === 'reminders') {
			params = { reminder: 'not_null' };
		}

		return api.get('mock/notes/items', { searchParams: params }).json();
	},

	createNote: async (note: NotesNote) => {
		return api.post('mock/notes/items', { json: note }).json();
	},

	getNote: async (noteId: string): Promise<NotesNote> => {
		return api.get(`mock/notes/items/${noteId}`).json();
	},

	updateNote: async (note: NotesNote) => {
		return api.put(`mock/notes/items/${note.id}`, { json: note }).json();
	},

	deleteNote: async (noteId: string) => {
		return api.delete(`mock/notes/items/${noteId}`).json();
	},

	getLabels: async (): Promise<NotesLabel[]> => {
		return api.get('mock/notes/labels').json();
	},

	createLabel: async (label: NotesLabel) => {
		return api.post('mock/notes/labels', { json: label }).json();
	},

	getLabel: async (labelId: string): Promise<NotesLabel> => {
		return api.get(`mock/notes/labels/${labelId}`).json();
	},

	updateLabel: async (label: NotesLabel) => {
		return api.put(`mock/notes/labels/${label.id}`, { json: label }).json();
	},

	deleteLabel: async (labelId: string) => {
		return api.delete(`mock/notes/labels/${labelId}`).json();
	},

	getArchivedNotes: async (): Promise<NotesNote[]> => {
		return api.get('mock/notes/archive').json();
	},

	getReminderNotes: async (): Promise<NotesNote[]> => {
		return api.get('mock/notes/reminder').json();
	}
};
