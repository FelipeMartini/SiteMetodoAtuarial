import { Menu, MenuItem, ListItemIcon, ListItemText, Button } from '@mui/material';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PresetsDialog from '../dialogs/preset/AiImageGenPresetsDialog';
import SavePresetDialog from '../dialogs/save-preset/AiImageGenSavePresetDialog';
import { AiImageGenPreset } from '../../api/types';
import { ButtonProps } from '@mui/material/Button';

type AiImageGenPresetsMenuProps = ButtonProps & {
	onLoadPreset: (preset: AiImageGenPreset) => void;
	onSavePreset: (name: string) => void;
};

function AiImageGenPresetsMenu(props: AiImageGenPresetsMenuProps) {
	const { onLoadPreset, onSavePreset, ...rest } = props;
	const [presetMenuAnchor, setPresetMenuAnchor] = useState<null | HTMLElement>(null);
	const [savePresetDialog, setSavePresetDialog] = useState(false);
	const [loadPresetDialog, setLoadPresetDialog] = useState(false);

	const loadPreset = (preset: AiImageGenPreset) => {
		onLoadPreset(preset);
		setPresetMenuAnchor(null);
	};

	return (
		<>
			<Button
				variant="contained"
				onClick={(e) => setPresetMenuAnchor(e.currentTarget)}
				startIcon={<FuseSvgIcon>lucide:settings-2</FuseSvgIcon>}
				{...rest}
			>
				Presets
			</Button>
			{/* Presets Menu */}
			<Menu
				anchorEl={presetMenuAnchor}
				open={Boolean(presetMenuAnchor)}
				onClose={() => setPresetMenuAnchor(null)}
				transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
				anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
			>
				<MenuItem
					onClick={() => {
						setSavePresetDialog(true);
						setPresetMenuAnchor(null);
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon>lucide:bookmark</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText primary="Save Current Settings" />
				</MenuItem>
				<MenuItem
					onClick={() => {
						setLoadPresetDialog(true);
						setPresetMenuAnchor(null);
					}}
				>
					<ListItemIcon>
						<FuseSvgIcon>lucide:folder-open</FuseSvgIcon>
					</ListItemIcon>
					<ListItemText primary="Load Preset" />
				</MenuItem>
			</Menu>

			<SavePresetDialog
				open={savePresetDialog}
				onClose={() => setSavePresetDialog(false)}
				onSave={onSavePreset}
			/>

			<PresetsDialog
				open={loadPresetDialog}
				onClose={() => setLoadPresetDialog(false)}
				onLoad={loadPreset}
			/>
		</>
	);
}

export default AiImageGenPresetsMenu;
