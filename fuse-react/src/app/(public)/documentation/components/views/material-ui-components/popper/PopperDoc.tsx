// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimplePopperComponent from '../../../ui/material-ui-components/popper/SimplePopper';
import SimplePopperRaw from '../../../ui/material-ui-components/popper/SimplePopper.tsx?raw';
import TransitionsPopperComponent from '../../../ui/material-ui-components/popper/TransitionsPopper';
import TransitionsPopperRaw from '../../../ui/material-ui-components/popper/TransitionsPopper.tsx?raw';
import SpringPopperComponent from '../../../ui/material-ui-components/popper/SpringPopper';
import SpringPopperRaw from '../../../ui/material-ui-components/popper/SpringPopper.tsx?raw';
import PositionedPopperComponent from '../../../ui/material-ui-components/popper/PositionedPopper';
import PositionedPopperRaw from '../../../ui/material-ui-components/popper/PositionedPopper.tsx?raw';
import VirtualElementPopperComponent from '../../../ui/material-ui-components/popper/VirtualElementPopper';
import VirtualElementPopperRaw from '../../../ui/material-ui-components/popper/VirtualElementPopper.tsx?raw';
import PopperPopupStateComponent from '../../../ui/material-ui-components/popper/PopperPopupState';
import PopperPopupStateRaw from '../../../ui/material-ui-components/popper/PopperPopupState.tsx?raw';

function PopperDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/popper"
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
				Popper
			</Typography>
			<Typography className="description">
				A Popper can be used to display some content on top of another. It's an alternative to react-popper.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Some important features of the Popper component:
			</Typography>
			<ul className="space-y-4">
				<li>
					🕷 Popper relies on the 3rd party library (<a href="https://popper.js.org/docs/v2/">Popper.js</a>)
					for perfect positioning.
				</li>
				<li>💄 It&#39;s an alternative API to react-popper. It aims for simplicity.</li>
				<li>
					Its child element is a <a href="https://v6.mui.com/base-ui/react-portal/">MUI Base Portal</a> on the
					body of the document to avoid rendering problems. You can disable this behavior with{' '}
					<code>disablePortal</code>.
				</li>
				<li>
					The scroll isn&#39;t blocked like with the <a href="/material-ui/react-popover/">Popover</a>{' '}
					component. The placement of the popper updates with the available area in the viewport.
				</li>
				<li>
					Clicking away does not hide the Popper component. If you need this behavior, you can use the{' '}
					<a href="https://v6.mui.com/base-ui/react-click-away-listener/">MUI Base Click-Away Listener</a> -
					see the example in the{' '}
					<a href="/material-ui/react-menu/#composition-with-menu-list">menu documentation section</a>.
				</li>
				<li>
					The <code>anchorEl</code> is passed as the reference object to create a new <code>Popper.js</code>{' '}
					instance.
				</li>
			</ul>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic Popper
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimplePopper.js"
					className="my-4"
					iframe={false}
					component={SimplePopperComponent}
					raw={SimplePopperRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Transitions
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The open/close state of the popper can be animated with a render prop child and a transition component.
				This component should respect the following conditions:
			</Typography>
			<ul className="space-y-4">
				<li>Be a direct child descendent of the popper.</li>
				<li>
					Call the <code>onEnter</code> callback prop when the enter transition starts.
				</li>
				<li>
					Call the <code>onExited</code> callback prop when the exit transition is completed. These two
					callbacks allow the popper to unmount the child content when closed and fully transitioned.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Popper has built-in support for{' '}
				<a href="https://github.com/reactjs/react-transition-group">react-transition-group</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TransitionsPopper.js"
					className="my-4"
					iframe={false}
					component={TransitionsPopperComponent}
					raw={TransitionsPopperRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Alternatively, you can use <a href="https://github.com/pmndrs/react-spring">react-spring</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SpringPopper.js"
					className="my-4"
					iframe={false}
					component={SpringPopperComponent}
					raw={SpringPopperRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Positioned popper
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="PositionedPopper.js"
					className="my-4"
					iframe={false}
					component={PositionedPopperComponent}
					raw={PositionedPopperRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Scroll playground
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Virtual element
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The value of the <code>anchorEl</code> prop can be a reference to a fake DOM element. You need to create
				an object shaped like the{' '}
				<a href="https://popper.js.org/docs/v2/virtual-elements/">
					<code>VirtualElement</code>
				</a>
				.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Highlight part of the text to see the popper:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="VirtualElementPopper.js"
					className="my-4"
					iframe={false}
					component={VirtualElementPopperComponent}
					raw={VirtualElementPopperRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Supplementary projects
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For more advanced use cases you might be able to take advantage of:
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				material-ui-popup-state
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<img
					src="https://img.shields.io/github/stars/jcoreio/material-ui-popup-state?style=social&label=Star"
					alt="stars"
				/>
				<img
					src="https://img.shields.io/npm/dm/material-ui-popup-state.svg"
					alt="npm downloads"
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The package{' '}
				<a href="https://github.com/jcoreio/material-ui-popup-state">
					<code>material-ui-popup-state</code>
				</a>{' '}
				that takes care of popper state for you in most cases.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="PopperPopupState.js"
					className="my-4"
					iframe={false}
					component={PopperPopupStateComponent}
					raw={PopperPopupStateRaw}
				/>
			</Typography>
		</>
	);
}

export default PopperDoc;
