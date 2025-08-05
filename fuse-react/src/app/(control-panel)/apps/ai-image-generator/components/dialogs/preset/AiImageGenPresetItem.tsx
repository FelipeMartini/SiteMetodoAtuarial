import { Typography, IconButton, Chip, lighten, Box } from '@mui/material';
import { format } from 'date-fns';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MouseEventHandler, MouseEvent } from 'react';
import { AiImageGenPreset } from '../../../api/types';
import { useDeletePreset } from '../../../api/hooks/presets/useDeletePreset';

type AiImageGenPresetItemProps = {
	preset: AiImageGenPreset;
	onClick: MouseEventHandler<HTMLDivElement>;
};

function AiImageGenPresetItem(props: AiImageGenPresetItemProps) {
	const { preset, onClick } = props;
	const { mutate: removePreset } = useDeletePreset();

	function handleRemovePreset(ev: MouseEvent<HTMLButtonElement>) {
		ev.stopPropagation();
		removePreset(preset.id);
	}

	return (
		<Box
			className="border-divider flex h-auto max-h-none min-h-0 w-full cursor-pointer flex-col items-start gap-2 overflow-hidden rounded-md border p-4 transition-shadow duration-200 hover:shadow-xs"
			sx={(theme) => ({
				backgroundColor: lighten(theme.palette.background.default, 0.02),
				...theme.applyStyles('light', {
					backgroundColor: lighten(theme.palette.background.default, 0.4)
				}),
				'&:hover': {
					backgroundColor: lighten(theme.palette.background.default, 0.2)
				}
			})}
			onClick={onClick}
		>
			<div className="flex w-full items-center justify-between">
				<Typography className="text-md font-medium">{preset.name}</Typography>
				<div className="flex items-center gap-2">
					<Typography
						color="textSecondary"
						className="text-xs"
					>
						Created {format(new Date(preset.createdAt), 'MMM d, yyyy')}
					</Typography>
					<IconButton
						size="small"
						onClick={handleRemovePreset}
					>
						<FuseSvgIcon>lucide:trash</FuseSvgIcon>
					</IconButton>
				</div>
			</div>
			<div className="mb-3 flex gap-2">
				<Chip
					className="rounded-xs text-sm"
					label={preset.settings.style}
					size="small"
					variant="outlined"
				/>
				<Chip
					className="rounded-xs text-sm"
					label={preset.settings.mood}
					size="small"
					variant="outlined"
				/>
				<Chip
					className="rounded-xs text-sm"
					label={preset.settings.size}
					size="small"
					variant="outlined"
				/>
				<Chip
					className="rounded-xs text-sm"
					label={preset.settings.quality}
					size="small"
					variant="outlined"
				/>
			</div>
			<Typography
				className="text-sm"
				noWrap
			>
				{preset.settings.prompt}
			</Typography>

			<Typography
				className="text-xs italic"
				color="text.secondary"
				noWrap
			>
				{preset.settings.negativePrompt} (Negative Prompt)
			</Typography>
		</Box>
	);
}

export default AiImageGenPresetItem;
