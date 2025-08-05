import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { ReactElement, ReactNode } from 'react';
import { useNotesAppContext } from '../../../contexts/NotesAppContext/useNotesAppContext';
import NoteForm from '../../forms/note-form/NoteForm';

type TransitionProps = {
	children: ReactElement<ReactNode>;
	ref?: React.RefObject<HTMLDivElement>;
};

const Transition = function Transition(props: TransitionProps) {
	const { children, ref, ...other } = props;

	return (
		<Slide
			direction="up"
			ref={ref}
			{...other}
		>
			{children}
		</Slide>
	);
};

/**
 * The note dialog.
 */
function NoteDialog() {
	const { closeNoteDialog, noteDialogId } = useNotesAppContext();

	return (
		<Dialog
			classes={{
				paper: 'w-full m-6'
			}}
			slots={{
				transition: Transition
			}}
			onClose={() => closeNoteDialog()}
			open={Boolean(noteDialogId)}
		>
			<NoteForm onClose={() => closeNoteDialog()} />
		</Dialog>
	);
}

export default NoteDialog;
