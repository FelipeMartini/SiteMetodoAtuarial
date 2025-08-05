// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimpleBackdropComponent from '../../../ui/material-ui-components/backdrop/SimpleBackdrop';
import SimpleBackdropRaw from '../../../ui/material-ui-components/backdrop/SimpleBackdrop.tsx?raw';

function BackdropDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/backdrop"
				target="_blank"
				role="button"
				size="small"
				startIcon={<FuseSvgIcon size={16}>lucide:square-arrow-out-up-right</FuseSvgIcon>}
			>
				Reference
			</Button>
			<Typography
				className="my-4 text-5xl font-bold"
				component="h1"
			>
				Backdrop
			</Typography>
			<Typography className="description">
				The Backdrop component narrows the user's focus to a particular element on the screen.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Backdrop signals a state change within the application and can be used for creating loaders,
				dialogs, and more. In its simplest form, the Backdrop component will add a dimmed layer over your
				application.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Example
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The demo below shows a basic Backdrop with a Circular Progress component in the foreground to indicate a
				loading state. After clicking <strong>Show Backdrop</strong>, you can click anywhere on the page to
				close it.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleBackdrop.js"
					className="my-4"
					iframe={false}
					component={SimpleBackdropComponent}
					raw={SimpleBackdropRaw}
				/>
			</Typography>
		</>
	);
}

export default BackdropDoc;
