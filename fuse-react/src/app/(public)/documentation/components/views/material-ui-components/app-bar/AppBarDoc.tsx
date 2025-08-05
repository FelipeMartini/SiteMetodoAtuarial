// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ButtonAppBarComponent from '../../../ui/material-ui-components/app-bar/ButtonAppBar';
import ButtonAppBarRaw from '../../../ui/material-ui-components/app-bar/ButtonAppBar.tsx?raw';
import MenuAppBarComponent from '../../../ui/material-ui-components/app-bar/MenuAppBar';
import MenuAppBarRaw from '../../../ui/material-ui-components/app-bar/MenuAppBar.tsx?raw';
import ResponsiveAppBarComponent from '../../../ui/material-ui-components/app-bar/ResponsiveAppBar';
import ResponsiveAppBarRaw from '../../../ui/material-ui-components/app-bar/ResponsiveAppBar.tsx?raw';
import SearchAppBarComponent from '../../../ui/material-ui-components/app-bar/SearchAppBar';
import SearchAppBarRaw from '../../../ui/material-ui-components/app-bar/SearchAppBar.tsx?raw';
import DrawerAppBarComponent from '../../../ui/material-ui-components/app-bar/DrawerAppBar';
import DrawerAppBarRaw from '../../../ui/material-ui-components/app-bar/DrawerAppBar.tsx?raw';
import PrimarySearchAppBarComponent from '../../../ui/material-ui-components/app-bar/PrimarySearchAppBar';
import PrimarySearchAppBarRaw from '../../../ui/material-ui-components/app-bar/PrimarySearchAppBar.tsx?raw';
import DenseAppBarComponent from '../../../ui/material-ui-components/app-bar/DenseAppBar';
import DenseAppBarRaw from '../../../ui/material-ui-components/app-bar/DenseAppBar.tsx?raw';
import ProminentAppBarComponent from '../../../ui/material-ui-components/app-bar/ProminentAppBar';
import ProminentAppBarRaw from '../../../ui/material-ui-components/app-bar/ProminentAppBar.tsx?raw';
import BottomAppBarComponent from '../../../ui/material-ui-components/app-bar/BottomAppBar';
import BottomAppBarRaw from '../../../ui/material-ui-components/app-bar/BottomAppBar.tsx?raw';
import HideAppBarComponent from '../../../ui/material-ui-components/app-bar/HideAppBar';
import HideAppBarRaw from '../../../ui/material-ui-components/app-bar/HideAppBar.tsx?raw';
import ElevateAppBarComponent from '../../../ui/material-ui-components/app-bar/ElevateAppBar';
import ElevateAppBarRaw from '../../../ui/material-ui-components/app-bar/ElevateAppBar.tsx?raw';
import BackToTopComponent from '../../../ui/material-ui-components/app-bar/BackToTop';
import BackToTopRaw from '../../../ui/material-ui-components/app-bar/BackToTop.tsx?raw';
import EnableColorOnDarkAppBarComponent from '../../../ui/material-ui-components/app-bar/EnableColorOnDarkAppBar';
import EnableColorOnDarkAppBarRaw from '../../../ui/material-ui-components/app-bar/EnableColorOnDarkAppBar.tsx?raw';

function AppBarDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/app-bar"
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
				App Bar
			</Typography>
			<Typography className="description">
				The App Bar displays information and actions relating to the current screen.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The top App bar provides content and actions related to the current screen. It&#39;s used for branding,
				screen titles, navigation, and actions.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				It can transform into a contextual action bar or be used as a navbar.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic App bar
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ButtonAppBar.js"
					className="my-4"
					iframe={false}
					component={ButtonAppBarComponent}
					raw={ButtonAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				App bar with menu
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="MenuAppBar.js"
					className="my-4"
					iframe={false}
					component={MenuAppBarComponent}
					raw={MenuAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				App bar with responsive menu
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ResponsiveAppBar.js"
					className="my-4"
					iframe={false}
					component={ResponsiveAppBarComponent}
					raw={ResponsiveAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				App bar with search field
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A side searchbar.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SearchAppBar.js"
					className="my-4"
					iframe={false}
					component={SearchAppBarComponent}
					raw={SearchAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Responsive App bar with Drawer
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DrawerAppBar.js"
					className="my-4"
					iframe
					component={DrawerAppBarComponent}
					raw={DrawerAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				App bar with a primary search field
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A primary searchbar.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="PrimarySearchAppBar.js"
					className="my-4"
					iframe={false}
					component={PrimarySearchAppBarComponent}
					raw={PrimarySearchAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Dense (desktop only)
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DenseAppBar.js"
					className="my-4"
					iframe={false}
					component={DenseAppBarComponent}
					raw={DenseAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Prominent
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A prominent app bar.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ProminentAppBar.js"
					className="my-4"
					iframe={false}
					component={ProminentAppBarComponent}
					raw={ProminentAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Bottom App bar
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BottomAppBar.js"
					className="my-4"
					iframe
					component={BottomAppBarComponent}
					raw={BottomAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Fixed placement
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				When you render the app bar position fixed, the dimension of the element doesn&#39;t impact the rest of
				the page. This can cause some part of your content to be invisible, behind the app bar. Here are 3
				possible solutions:
			</Typography>
			<ol>
				<li>
					You can use <code>{`position="sticky"`}</code> instead of fixed.
				</li>
				<li>
					You can render a second <code>{`<Toolbar />`}</code> component:
				</li>
			</ol>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
function App() {
  return (
    <React.Fragment>
      <AppBar position="fixed">
        <Toolbar>{/* content */}</Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
}
`}
			</FuseHighlight>
			<ol start={3}>
				<li>
					You can use <code>theme.mixins.toolbar</code> CSS:
				</li>
			</ol>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

function App() {
  return (
    <React.Fragment>
      <AppBar position="fixed">
        <Toolbar>{/* content */}</Toolbar>
      </AppBar>
      <Offset />
    </React.Fragment>
  );
}
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Scrolling
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the <code>useScrollTrigger()</code> hook to respond to user scroll actions.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Hide App bar
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The app bar hides on scroll down to leave more space for reading.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="HideAppBar.js"
					className="my-4"
					iframe
					component={HideAppBarComponent}
					raw={HideAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Elevate App bar
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The app bar elevates on scroll to communicate that the user is not at the top of the page.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ElevateAppBar.js"
					className="my-4"
					iframe
					component={ElevateAppBarComponent}
					raw={ElevateAppBarRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Back to top
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A floating action button appears on scroll to make it easy to get back to the top of the page.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BackToTop.js"
					className="my-4"
					iframe
					component={BackToTopComponent}
					raw={BackToTopRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				<code>{`useScrollTrigger([options]) => trigger`}</code>
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Arguments
			</Typography>
			<ol>
				<li>
					<Typography
						className="mb-8 text-base"
						component="div"
					>
						<code>options</code> (<em>object</em> [optional]):
					</Typography>
					<ul className="space-y-4">
						<li>
							<code>options.disableHysteresis</code> (<em>bool</em> [optional]): Defaults to{' '}
							<code>false</code>. Disable the hysteresis. Ignore the scroll direction when determining the{' '}
							<code>trigger</code> value.
						</li>
						<li>
							<code>options.target</code> (<em>Node</em> [optional]): Defaults to <code>window</code>.
						</li>
						<li>
							<code>options.threshold</code> (<em>number</em> [optional]): Defaults to <code>100</code>.
							Change the <code>trigger</code> value when the vertical scroll strictly crosses this
							threshold (exclusive).
						</li>
					</ul>
				</li>
			</ol>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Returns
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>trigger</code>: Does the scroll position match the criteria?
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Examples
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
import useScrollTrigger from '@mui/material/useScrollTrigger';

function HideOnScroll(props) {
  const trigger = useScrollTrigger();
  return (
    <Slide in={!trigger}>
      <div>Hello</div>
    </Slide>
  );
}
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Enable color on dark
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Following the{' '}
				<a href="https://m2.material.io/design/color/dark-theme.html">Material Design guidelines</a>, the{' '}
				<code>color</code> prop has no effect on the appearance of the app bar in dark mode. You can override
				this behavior by setting the <code>enableColorOnDark</code> prop to <code>true</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="EnableColorOnDarkAppBar.js"
					className="my-4"
					iframe={false}
					component={EnableColorOnDarkAppBarComponent}
					raw={EnableColorOnDarkAppBarRaw}
				/>
			</Typography>
		</>
	);
}

export default AppBarDoc;
