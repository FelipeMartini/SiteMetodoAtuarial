import React from 'react';
import { FuseDialog, FuseDialogProps } from '../../FuseDialog';
import { FuseDialogContext, FuseDialogDefaultContext } from './FuseDialogContext';

interface FuseDialogContextProviderProps {
	children: React.ReactNode;
}

export function FuseDialogContextProvider(props: FuseDialogContextProviderProps) {
	const { children } = props;
	const [dialogs, setDialogs] = React.useState(FuseDialogDefaultContext.dialogs);

	function openDialog(dialogProps: FuseDialogProps) {
		setDialogs((prev) => ({
			...prev,
			[dialogProps.id]: { ...dialogProps, open: true }
		}));
	}

	function closeDialog(id: FuseDialogProps['id']) {
		setDialogs((prev) => {
			const newDialogs = { ...prev };
			delete newDialogs[id];

			return newDialogs;
		});
	}

	return (
		<FuseDialogContext.Provider value={{ dialogs, openDialog, closeDialog }}>
			{children}
			{Object.entries(dialogs).map(([id, dialog]) => (
				<FuseDialog
					{...dialog}
					key={id}
					onClose={closeDialog}
				/>
			))}
		</FuseDialogContext.Provider>
	);
}
