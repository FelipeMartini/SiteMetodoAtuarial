import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	FormControl,
	FormLabel
} from '@mui/material';
import { useEffect, useState } from 'react';

type AiImageGenSavePresetDialogProps = {
	open: boolean;
	onClose: () => void;
	onSave: (name: string) => void;
};

function AiImageGenSavePresetDialog(props: AiImageGenSavePresetDialogProps) {
	const { open, onClose, onSave } = props;
	const [newPresetName, setNewPresetName] = useState('');

	const handleSave = () => {
		onSave(newPresetName);
		onClose();
	};

	useEffect(() => {
		setNewPresetName('');
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle className="text-lg">Save Current Settings as Preset</DialogTitle>
			<DialogContent>
				<FormControl className="w-full">
					<FormLabel htmlFor="preset-name">Preset Name</FormLabel>
					<TextField
						autoFocus
						id="preset-name"
						fullWidth
						value={newPresetName}
						onChange={(e) => setNewPresetName(e.target.value)}
						helperText="This will save all current settings as a new preset"
					/>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={handleSave}
					variant="contained"
				>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default AiImageGenSavePresetDialog;
