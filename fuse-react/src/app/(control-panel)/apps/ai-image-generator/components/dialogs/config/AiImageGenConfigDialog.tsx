import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Alert,
	TextField,
	FormControl,
	FormLabel
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState, useCallback } from 'react';
import useAiImageGenAppContext from '../../../contexts/AiImageGenAppContext/useAiImageGenAppContext';

function AiImageGenConfigDialog() {
	const { setConfigDialogOpen, configDialogOpen, apiKey, setApiKey } = useAiImageGenAppContext();
	const [apiKeyInputValue, setApiKeyInputValue] = useState(apiKey);

	useEffect(() => {
		setApiKeyInputValue(apiKey);
	}, [apiKey]);

	const handleClose = useCallback(() => {
		setConfigDialogOpen(false);
	}, [setConfigDialogOpen]);

	const handleSave = useCallback(() => {
		setApiKey(apiKeyInputValue);
		handleClose();
	}, [apiKeyInputValue, handleClose, setApiKey]);

	return (
		<>
			<Button
				variant="contained"
				color="secondary"
				onClick={() => setConfigDialogOpen(true)}
				startIcon={<FuseSvgIcon>lucide:settings</FuseSvgIcon>}
			>
				Settings
			</Button>
			<Dialog
				open={configDialogOpen}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				disableRestoreFocus
			>
				<DialogTitle className="text-lg">Configuration</DialogTitle>
				<DialogContent>
					<Alert
						severity="info"
						className="mb-4"
					>
						Your API key is not stored, you can use your api key to test the app.
					</Alert>

					<FormControl className="w-full">
						<FormLabel htmlFor="api-key-input">OpenAI API Key</FormLabel>
						<TextField
							id="api-key-input"
							autoFocus
							value={apiKeyInputValue}
							onChange={(e) => setApiKeyInputValue(e.target.value)}
							type="password"
							autoComplete="off"
							helperText="Enter your OpenAI API key to use the image generator"
							fullWidth
						/>
					</FormControl>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button
						onClick={handleSave}
						variant="contained"
						color="primary"
					>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}

export default AiImageGenConfigDialog;
