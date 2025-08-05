import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import NewLabelForm from './NewLabelForm';
import LabelItemForm from './LabelItemForm';
import { useLabels } from '../../../api/hooks/labels/useLabels';
import { useNotesAppContext } from '../../../contexts/NotesAppContext/useNotesAppContext';

/**
 * The labels dialog.
 */
function LabelsDialog() {
	const { closeLabelsDialog, labelsDialogOpen } = useNotesAppContext();
	const { data: labels } = useLabels();

	return (
		<Dialog
			classes={{
				paper: 'w-full max-w-80 p-4 md:p-6 m-6'
			}}
			onClose={() => closeLabelsDialog()}
			open={Boolean(labelsDialogOpen)}
		>
			<Typography className="mb-4 text-2xl font-semibold">Edit Labels</Typography>

			<List dense>
				<NewLabelForm />

				{labels?.map((item) => (
					<LabelItemForm
						label={item}
						key={item.id}
					/>
				))}
			</List>
		</Dialog>
	);
}

export default LabelsDialog;
