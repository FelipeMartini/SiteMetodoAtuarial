export type NoteListItemType = {
	id: string;
	content: string;
	completed: boolean;
};

export type NotesNote = {
	id: string;
	title: string;
	content: string;
	tasks?: NoteListItemType[];
	image?: string | null;
	reminder?: string | null;
	labels: string[];
	archived: boolean;
	createdAt: string;
	updatedAt?: string | null;
};

export type NotesLabel = {
	id: string;
	title: string;
};

export type RouteParams = Partial<{
	filter: string;
	id: string;
}>;
