// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FloatingActionButtonsComponent from '../../../ui/material-ui-components/floating-action-button/FloatingActionButtons';
import FloatingActionButtonsRaw from '../../../ui/material-ui-components/floating-action-button/FloatingActionButtons.tsx?raw';
import FloatingActionButtonSizeComponent from '../../../ui/material-ui-components/floating-action-button/FloatingActionButtonSize';
import FloatingActionButtonSizeRaw from '../../../ui/material-ui-components/floating-action-button/FloatingActionButtonSize.tsx?raw';
import FloatingActionButtonExtendedSizeComponent from '../../../ui/material-ui-components/floating-action-button/FloatingActionButtonExtendedSize';
import FloatingActionButtonExtendedSizeRaw from '../../../ui/material-ui-components/floating-action-button/FloatingActionButtonExtendedSize.tsx?raw';
import FloatingActionButtonZoomComponent from '../../../ui/material-ui-components/floating-action-button/FloatingActionButtonZoom';
import FloatingActionButtonZoomRaw from '../../../ui/material-ui-components/floating-action-button/FloatingActionButtonZoom.tsx?raw';

function FloatingActionButtonDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/floating-action-button"
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
				Floating Action Button
			</Typography>
			<Typography className="description">
				A Floating Action Button (FAB) performs the primary, or most common, action on a screen.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A floating action button appears in front of all screen content, typically as a circular shape with an
				icon in its center. FABs come in two types: regular, and extended.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Only use a FAB if it is the most suitable way to present a screen&#39;s primary action. Only one
				component is recommended per screen to represent the most common action.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic FAB
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FloatingActionButtons.js"
					className="my-4"
					iframe={false}
					component={FloatingActionButtonsComponent}
					raw={FloatingActionButtonsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Size
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				By default, the size is <code>large</code>. Use the <code>size</code> prop for smaller floating action
				buttons.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FloatingActionButtonSize.js"
					className="my-4"
					iframe={false}
					component={FloatingActionButtonSizeComponent}
					raw={FloatingActionButtonSizeRaw}
				/>
				<FuseExample
					name="FloatingActionButtonExtendedSize.js"
					className="my-4"
					iframe={false}
					component={FloatingActionButtonExtendedSizeComponent}
					raw={FloatingActionButtonExtendedSizeRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Animation
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The floating action button animates onto the screen as an expanding piece of material, by default.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A floating action button that spans multiple lateral screens (such as tabbed screens) should briefly
				disappear, then reappear if its action changes.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Zoom transition can be used to achieve this. Note that since both the exiting and entering
				animations are triggered at the same time, we use <code>enterDelay</code> to allow the outgoing Floating
				Action Button&#39;s animation to finish before the new one enters.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FloatingActionButtonZoom.js"
					className="my-4"
					iframe={false}
					component={FloatingActionButtonZoomComponent}
					raw={FloatingActionButtonZoomRaw}
				/>
			</Typography>
		</>
	);
}

export default FloatingActionButtonDoc;
