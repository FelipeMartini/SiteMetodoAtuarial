// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicSpeedDialComponent from '../../../ui/material-ui-components/speed-dial/BasicSpeedDial';
import BasicSpeedDialRaw from '../../../ui/material-ui-components/speed-dial/BasicSpeedDial.tsx?raw';
import PlaygroundSpeedDialComponent from '../../../ui/material-ui-components/speed-dial/PlaygroundSpeedDial';
import PlaygroundSpeedDialRaw from '../../../ui/material-ui-components/speed-dial/PlaygroundSpeedDial.tsx?raw';
import ControlledOpenSpeedDialComponent from '../../../ui/material-ui-components/speed-dial/ControlledOpenSpeedDial';
import ControlledOpenSpeedDialRaw from '../../../ui/material-ui-components/speed-dial/ControlledOpenSpeedDial.tsx?raw';
import OpenIconSpeedDialComponent from '../../../ui/material-ui-components/speed-dial/OpenIconSpeedDial';
import OpenIconSpeedDialRaw from '../../../ui/material-ui-components/speed-dial/OpenIconSpeedDial.tsx?raw';
import SpeedDialTooltipOpenComponent from '../../../ui/material-ui-components/speed-dial/SpeedDialTooltipOpen';
import SpeedDialTooltipOpenRaw from '../../../ui/material-ui-components/speed-dial/SpeedDialTooltipOpen.tsx?raw';

function SpeedDialDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/speed-dial"
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
				Speed Dial
			</Typography>
			<Typography className="description">
				When pressed, a floating action button can display three to six related actions in the form of a Speed
				Dial.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If more than six actions are needed, something other than a FAB should be used to present them.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic speed dial
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The floating action button can display related actions.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicSpeedDial.js"
					className="my-4"
					iframe={false}
					component={BasicSpeedDialComponent}
					raw={BasicSpeedDialRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Playground
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="PlaygroundSpeedDial.js"
					className="my-4"
					iframe={false}
					component={PlaygroundSpeedDialComponent}
					raw={PlaygroundSpeedDialRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Controlled speed dial
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The open state of the component can be controlled with the <code>open</code>/<code>onOpen</code>/
				<code>onClose</code> props.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ControlledOpenSpeedDial.js"
					className="my-4"
					iframe={false}
					component={ControlledOpenSpeedDialComponent}
					raw={ControlledOpenSpeedDialRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Custom close icon
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can provide an alternate icon for the closed and open states using the <code>icon</code> and{' '}
				<code>openIcon</code> props of the <code>SpeedDialIcon</code> component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="OpenIconSpeedDial.js"
					className="my-4"
					iframe={false}
					component={OpenIconSpeedDialComponent}
					raw={OpenIconSpeedDialRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Persistent action tooltips
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The SpeedDialActions tooltips can be displayed persistently so that users don&#39;t have to long-press
				to see the tooltip on touch devices.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				It is enabled here across all devices for demo purposes, but in production it could use the{' '}
				<code>isTouch</code> logic to conditionally set the prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SpeedDialTooltipOpen.js"
					className="my-4"
					iframe={false}
					component={SpeedDialTooltipOpenComponent}
					raw={SpeedDialTooltipOpenRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Accessibility
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				ARIA
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Required
			</Typography>
			<ul className="space-y-4">
				<li>
					You should provide an <code>ariaLabel</code> for the speed dial component.
				</li>
				<li>
					You should provide a <code>tooltipTitle</code> for each speed dial action.
				</li>
			</ul>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Provided
			</Typography>
			<ul className="space-y-4">
				<li>
					The Fab has <code>aria-haspopup</code>, <code>aria-expanded</code> and <code>aria-controls</code>{' '}
					attributes.
				</li>
				<li>
					The speed dial actions container has <code>{`role="menu"`}</code> and <code>aria-orientation</code>{' '}
					set according to the direction.
				</li>
				<li>
					The speed dial actions have <code>{`role="menuitem"`}</code>, and an <code>aria-describedby</code>{' '}
					attribute that references the associated tooltip.
				</li>
			</ul>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Keyboard
			</Typography>
			<ul className="space-y-4">
				<li>The speed dial opens on focus.</li>
				<li>
					The Space and Enter keys trigger the selected speed dial action, and toggle the speed dial open
					state.
				</li>
				<li>
					The cursor keys move focus to the next or previous speed dial action. (Note that any cursor
					direction can be used initially to open the speed dial. This enables the expected behavior for the
					actual or perceived orientation of the speed dial, for example for a screen reader user who
					perceives the speed dial as a drop-down menu.)
				</li>
				<li>
					The Escape key closes the speed dial and, if a speed dial action was focused, returns focus to the
					Fab.
				</li>
			</ul>
		</>
	);
}

export default SpeedDialDoc;
