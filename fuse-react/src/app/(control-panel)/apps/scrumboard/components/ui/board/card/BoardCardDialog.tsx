import Dialog from '@mui/material/Dialog';
import BoardCardForm from './BoardCardForm';
import { useScrumboardAppContext } from '../../../../contexts/ScrumboardAppContext/useScrumboardAppContext';

/**
 * The board card dialog component.
 */
function BoardCardDialog() {
	const { cardDialog, closeCardDialog } = useScrumboardAppContext();

	return (
		<Dialog
			classes={{
				paper: 'max-w-2xl w-full m-2 sm:m-6'
			}}
			onClose={closeCardDialog}
			open={cardDialog.open}
		>
			<BoardCardForm />
		</Dialog>
	);
}

export default BoardCardDialog;
