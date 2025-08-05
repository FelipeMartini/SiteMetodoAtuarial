import { ReactNode } from 'react';
import Dialog from '@mui/material/Dialog';

export interface FuseDialogContentProps {
	handleClose: () => void;
	data?: unknown;
}

export interface FuseDialogProps {
	id: string;
	open?: boolean;
	onClose?: (T: string) => void;
	content: (T: FuseDialogContentProps) => ReactNode;
	data?: unknown;
	classes?: { paper?: string };
}

export function FuseDialog(props: FuseDialogProps) {
	const { id, open = false, onClose, content, data } = props;

	function handleClose() {
		onClose?.(id);
	}

	return (
		<Dialog
			open={open}
			onClose={() => handleClose()}
		>
			{content?.({ handleClose, data })}
		</Dialog>
	);
}
