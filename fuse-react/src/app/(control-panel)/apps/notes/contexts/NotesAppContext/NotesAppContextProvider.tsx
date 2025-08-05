import { useState, ReactNode } from 'react';
import { NotesAppContext } from './NotesAppContext';

export function NotesAppContextProvider({ children }: { children: ReactNode }) {
	const [noteDialogId, setNoteDialogId] = useState<string | null>(null);
	const [labelsDialogOpen, setLabelsDialogOpen] = useState(false);
	const [searchText, setSearchTextValue] = useState('');
	const [variateDesc, setVariateDesc] = useState(false);

	const openNoteDialog = (id: string) => setNoteDialogId(id);
	const closeNoteDialog = () => setNoteDialogId(null);
	const openLabelsDialog = () => setLabelsDialogOpen(true);
	const closeLabelsDialog = () => setLabelsDialogOpen(false);
	const setSearchText = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		setSearchTextValue(event.target.value || '');
	};
	const toggleVariateDescSize = () => setVariateDesc((prev) => !prev);

	const value = {
		noteDialogId,
		labelsDialogOpen,
		searchText,
		variateDesc,
		openNoteDialog,
		closeNoteDialog,
		openLabelsDialog,
		closeLabelsDialog,
		setSearchText,
		toggleVariateDescSize
	};

	return <NotesAppContext.Provider value={value}>{children}</NotesAppContext.Provider>;
}
