import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import { IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useState } from 'react';
import NewLabelForm from './NewLabelForm';
import LabelItemForm from './LabelItemForm';
import { useLabels } from '../../../api/hooks/labels/useLabels';

/**
 * The labels dialog.
 */
function LabelsDialog() {
	const [openDialog, setOpenDialog] = useState(false);
	const { data: labels } = useLabels();

	function handleOpenDialog() {
		setOpenDialog(true);
	}

	function handleCloseDialog() {
		setOpenDialog(false);
	}

	return (
		<>
			<IconButton
				onClick={handleOpenDialog}
				size="small"
			>
				<FuseSvgIcon color="secondary">lucide:square-pen</FuseSvgIcon>
			</IconButton>
			<Dialog
				classes={{
					paper: 'w-full max-w-80 p-6 md:p-10 m-6'
				}}
				onClose={handleCloseDialog}
				open={openDialog}
				disableRestoreFocus
			>
				<Typography className="mb-4 text-2xl font-semibold">Edit Labels</Typography>

				<List dense>
					<NewLabelForm />

					{labels?.map((item) => (
						<LabelItemForm
							label={item}
							key={item.id}
							isLast={labels.length === 1}
						/>
					))}
				</List>
			</Dialog>
		</>
	);
}

export default LabelsDialog;
