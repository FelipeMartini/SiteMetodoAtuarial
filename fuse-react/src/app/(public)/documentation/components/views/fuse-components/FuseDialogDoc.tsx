'use client';

import FuseHighlight from '@fuse/core/FuseHighlight';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useFuseDialogContext } from '@fuse/core/FuseDialog/contexts/FuseDialogContext/useFuseDialogContext';

/**
 * FuseDialog Doc
 * This document provides information on how to use the FuseDialog.
 */
function FuseDialogDoc() {
	const { openDialog } = useFuseDialogContext();

	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				FuseDialog
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FuseDialog</code> is a simple dialog trigger for easily showing dialog messages. It should be
				located in the theme layouts.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Usage
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				You can show a dialog anywhere by using the <code>openDialog</code> function from the{' '}
				<code>useFuseDialog</code> hook:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{`
                import { useFuseDialog } from '@fuse/core/FuseDialog/FuseDialogContext';

                function MyComponent() {
                    const { openDialog, closeDialog } = useFuseDialog();
                    
                    const handleOpenDialog = () => {
                        openDialog({
                            id: 'my-dialog',
                            content: ({ handleClose }) => (
                                <>
                                    <DialogTitle>Use Google's location service?</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Let Google help apps determine location. This means sending anonymous location data to
                                            Google, even when no apps are running.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose} color="primary">
                                            Disagree
                                        </Button>
                                        <Button onClick={handleClose} color="primary" autoFocus>
                                            Agree
                                        </Button>
                                    </DialogActions>
                                </>
                            )
                        });
                    };

                    return (
                        <Button
                            onClick={handleOpenDialog}
                            variant="contained"
                            color="secondary"
                        >
                            Open Dialog
                        </Button>
                    );
                }
                `}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Dialog Props
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				The <code>openDialog</code> function accepts the following props:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-tsx"
			>
				{`
                interface FuseDialogProps {
                    id: string;                                  // Unique identifier for the dialog
                    open?: boolean;                              // Control dialog visibility
                    onClose?: (id: string) => void;              // Custom close handler
                    content: (props: {                           // Render function for dialog content
                        handleClose: () => void;                 // Function to close the dialog
                        data?: unknown;                          // Optional data to pass to the content
                    }) => ReactNode;
                    data?: unknown;                              // Optional data
                    classes?: { paper?: string };                // Optional styling classes
                }
                `}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Example
			</Typography>

			<Button
				onClick={() => {
					openDialog({
						id: 'example-dialog',
						content: ({ handleClose }) => (
							<>
								<DialogTitle id="alert-dialog-title">Use Google's location service?</DialogTitle>
								<DialogContent>
									<DialogContentText id="alert-dialog-description">
										Let Google help apps determine location. This means sending anonymous location
										data to Google, even when no apps are running.
									</DialogContentText>
								</DialogContent>
								<DialogActions>
									<Button
										onClick={handleClose}
										color="primary"
									>
										Disagree
									</Button>
									<Button
										onClick={handleClose}
										color="primary"
										autoFocus
									>
										Agree
									</Button>
								</DialogActions>
							</>
						)
					});
				}}
				variant="contained"
				color="secondary"
			>
				Open Dialog
			</Button>
		</>
	);
}

export default FuseDialogDoc;
