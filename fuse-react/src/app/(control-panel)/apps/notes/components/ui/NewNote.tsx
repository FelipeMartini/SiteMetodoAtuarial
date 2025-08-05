import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import NoteForm from '../forms/note-form/NoteForm';

/**
 * The new note component.
 */
function NewNote() {
	const [formOpen, setFormOpen] = useState(false);

	function handleFormOpen(ev: React.MouseEvent<HTMLDivElement>) {
		ev.stopPropagation();
		setFormOpen(true);
		document.addEventListener('keydown', escFunction, false);
	}

	function handleFormClose() {
		if (!formOpen) {
			return;
		}

		setFormOpen(false);
		document.removeEventListener('keydown', escFunction, false);
	}

	function escFunction(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			handleFormClose();
		}
	}

	function handleClickAway(event: MouseEvent | TouchEvent) {
		const preventCloseElements = document.querySelector('.prevent-add-close');
		const preventClose = preventCloseElements ? preventCloseElements.contains(event.target as Node) : false;

		if (preventClose) {
			return;
		}

		handleFormClose();
	}

	return (
		<Paper
			className="flex min-h-10 w-full max-w-128 shrink-0 cursor-text items-center rounded-lg border"
			elevation={0}
		>
			{formOpen ? (
				<ClickAwayListener onClickAway={handleClickAway}>
					<div className="w-full">
						<NoteForm
							onClose={handleFormClose}
							variant="new"
						/>
					</div>
				</ClickAwayListener>
			) : (
				<Typography
					className="w-full px-3 text-lg"
					color="text.secondary"
					onClick={handleFormOpen}
				>
					Take a note...
				</Typography>
			)}
		</Paper>
	);
}

export default NewNote;
