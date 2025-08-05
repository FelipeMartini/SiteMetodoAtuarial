// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimpleBottomNavigationComponent from '../../../ui/material-ui-components/bottom-navigation/SimpleBottomNavigation';
import SimpleBottomNavigationRaw from '../../../ui/material-ui-components/bottom-navigation/SimpleBottomNavigation.tsx?raw';
import LabelBottomNavigationComponent from '../../../ui/material-ui-components/bottom-navigation/LabelBottomNavigation';
import LabelBottomNavigationRaw from '../../../ui/material-ui-components/bottom-navigation/LabelBottomNavigation.tsx?raw';
import FixedBottomNavigationComponent from '../../../ui/material-ui-components/bottom-navigation/FixedBottomNavigation';
import FixedBottomNavigationRaw from '../../../ui/material-ui-components/bottom-navigation/FixedBottomNavigation.tsx?raw';

function BottomNavigationDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/bottom-navigation"
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
				Bottom Navigation
			</Typography>
			<Typography className="description">
				The Bottom Navigation bar allows movement between primary destinations in an app.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Bottom navigation bars display three to five destinations at the bottom of a screen. Each destination is
				represented by an icon and an optional text label. When a bottom navigation icon is tapped, the user is
				taken to the top-level navigation destination associated with that icon.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Bottom navigation
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				When there are only <strong>three</strong> actions, display both icons and text labels at all times.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleBottomNavigation.js"
					className="my-4"
					iframe={false}
					component={SimpleBottomNavigationComponent}
					raw={SimpleBottomNavigationRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Bottom navigation with no label
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If there are <strong>four</strong> or <strong>five</strong> actions, display inactive views as icons
				only.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="LabelBottomNavigation.js"
					className="my-4"
					iframe={false}
					component={LabelBottomNavigationComponent}
					raw={LabelBottomNavigationRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Fixed positioning
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This demo keeps bottom navigation fixed to the bottom, no matter the amount of content on-screen.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FixedBottomNavigation.js"
					className="my-4"
					iframe
					component={FixedBottomNavigationComponent}
					raw={FixedBottomNavigationRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Third-party routing library
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				One frequent use case is to perform navigation on the client only, without an HTTP round-trip to the
				server. The <code>BottomNavigationAction</code> component provides the <code>component</code> prop to
				handle this use case. Here is a <a href="/material-ui/integrations/routing/">more detailed guide</a>.
			</Typography>
		</>
	);
}

export default BottomNavigationDoc;
