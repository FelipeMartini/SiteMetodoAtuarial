import { createContext } from 'react';

type NotesAppContextType = {
	noteDialogId: string | null;
	labelsDialogOpen: boolean;
	searchText: string;
	variateDesc: boolean;
	openNoteDialog: (id: string) => void;
	closeNoteDialog: () => void;
	openLabelsDialog: () => void;
	closeLabelsDialog: () => void;
	setSearchText: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
	toggleVariateDescSize: () => void;
};

export const NotesAppContext = createContext<NotesAppContextType | undefined>(undefined);
