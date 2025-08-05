// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicTabsComponent from '../../../ui/material-ui-components/tabs/BasicTabs';
import BasicTabsRaw from '../../../ui/material-ui-components/tabs/BasicTabs.tsx?raw';
import LabTabsComponent from '../../../ui/material-ui-components/tabs/LabTabs';
import LabTabsRaw from '../../../ui/material-ui-components/tabs/LabTabs.tsx?raw';
import TabsWrappedLabelComponent from '../../../ui/material-ui-components/tabs/TabsWrappedLabel';
import TabsWrappedLabelRaw from '../../../ui/material-ui-components/tabs/TabsWrappedLabel.tsx?raw';
import ColorTabsComponent from '../../../ui/material-ui-components/tabs/ColorTabs';
import ColorTabsRaw from '../../../ui/material-ui-components/tabs/ColorTabs.tsx?raw';
import DisabledTabsComponent from '../../../ui/material-ui-components/tabs/DisabledTabs';
import DisabledTabsRaw from '../../../ui/material-ui-components/tabs/DisabledTabs.tsx?raw';
import FullWidthTabsComponent from '../../../ui/material-ui-components/tabs/FullWidthTabs';
import FullWidthTabsRaw from '../../../ui/material-ui-components/tabs/FullWidthTabs.tsx?raw';
import CenteredTabsComponent from '../../../ui/material-ui-components/tabs/CenteredTabs';
import CenteredTabsRaw from '../../../ui/material-ui-components/tabs/CenteredTabs.tsx?raw';
import ScrollableTabsButtonAutoComponent from '../../../ui/material-ui-components/tabs/ScrollableTabsButtonAuto';
import ScrollableTabsButtonAutoRaw from '../../../ui/material-ui-components/tabs/ScrollableTabsButtonAuto.tsx?raw';
import ScrollableTabsButtonForceComponent from '../../../ui/material-ui-components/tabs/ScrollableTabsButtonForce';
import ScrollableTabsButtonForceRaw from '../../../ui/material-ui-components/tabs/ScrollableTabsButtonForce.tsx?raw';
import ScrollableTabsButtonVisibleComponent from '../../../ui/material-ui-components/tabs/ScrollableTabsButtonVisible';
import ScrollableTabsButtonVisibleRaw from '../../../ui/material-ui-components/tabs/ScrollableTabsButtonVisible.tsx?raw';
import ScrollableTabsButtonPreventComponent from '../../../ui/material-ui-components/tabs/ScrollableTabsButtonPrevent';
import ScrollableTabsButtonPreventRaw from '../../../ui/material-ui-components/tabs/ScrollableTabsButtonPrevent.tsx?raw';
import CustomizedTabsComponent from '../../../ui/material-ui-components/tabs/CustomizedTabs';
import CustomizedTabsRaw from '../../../ui/material-ui-components/tabs/CustomizedTabs.tsx?raw';
import VerticalTabsComponent from '../../../ui/material-ui-components/tabs/VerticalTabs';
import VerticalTabsRaw from '../../../ui/material-ui-components/tabs/VerticalTabs.tsx?raw';
import NavTabsComponent from '../../../ui/material-ui-components/tabs/NavTabs';
import NavTabsRaw from '../../../ui/material-ui-components/tabs/NavTabs.tsx?raw';
import IconTabsComponent from '../../../ui/material-ui-components/tabs/IconTabs';
import IconTabsRaw from '../../../ui/material-ui-components/tabs/IconTabs.tsx?raw';
import IconLabelTabsComponent from '../../../ui/material-ui-components/tabs/IconLabelTabs';
import IconLabelTabsRaw from '../../../ui/material-ui-components/tabs/IconLabelTabs.tsx?raw';
import IconPositionTabsComponent from '../../../ui/material-ui-components/tabs/IconPositionTabs';
import IconPositionTabsRaw from '../../../ui/material-ui-components/tabs/IconPositionTabs.tsx?raw';
import AccessibleTabs1Component from '../../../ui/material-ui-components/tabs/AccessibleTabs1';
import AccessibleTabs1Raw from '../../../ui/material-ui-components/tabs/AccessibleTabs1.tsx?raw';
import AccessibleTabs2Component from '../../../ui/material-ui-components/tabs/AccessibleTabs2';
import AccessibleTabs2Raw from '../../../ui/material-ui-components/tabs/AccessibleTabs2.tsx?raw';

function TabsDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/tabs"
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
				Tabs
			</Typography>
			<Typography className="description">
				Tabs make it easy to explore and switch between different views.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Tabs organize and allow navigation between groups of content that are related and at the same level of
				hierarchy.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Introduction
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Tabs are implemented using a collection of related components:
			</Typography>
			<ul className="space-y-4">
				<li>
					<code>{`<Tab />`}</code> - the tab element itself. Clicking on a tab displays its corresponding
					panel.
				</li>
				<li>
					<code>{`<Tabs />`}</code> - the container that houses the tabs. Responsible for handling focus and
					keyboard navigation between tabs.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicTabs.js"
					className="my-4"
					iframe={false}
					component={BasicTabsComponent}
					raw={BasicTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basics
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Experimental API
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>@mui/lab</code> offers utility components that inject props to implement accessible tabs following{' '}
				<a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/">WAI-ARIA Authoring Practices</a>:
			</Typography>
			<ul className="space-y-4">
				<li>
					<code>{`<TabList />`}</code> - the container that houses the tabs. Responsible for handling focus
					and keyboard navigation between tabs.
				</li>
				<li>
					<code>{`<TabPanel />`}</code> - the card that hosts the content associated with a tab.
				</li>
				<li>
					<code>{`<TabContext />`}</code> - the top-level component that wraps the Tab List and Tab Panel
					components.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="LabTabs.js"
					className="my-4"
					iframe={false}
					component={LabTabsComponent}
					raw={LabTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Wrapped labels
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Long labels will automatically wrap on tabs. If the label is too long for the tab, it will overflow, and
				the text will not be visible.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TabsWrappedLabel.js"
					className="my-4"
					iframe={false}
					component={TabsWrappedLabelComponent}
					raw={TabsWrappedLabelRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Colored tab
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColorTabs.js"
					className="my-4"
					iframe={false}
					component={ColorTabsComponent}
					raw={ColorTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Disabled tab
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A tab can be disabled by setting the <code>disabled</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DisabledTabs.js"
					className="my-4"
					iframe={false}
					component={DisabledTabsComponent}
					raw={DisabledTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Fixed tabs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Fixed tabs should be used with a limited number of tabs, and when a consistent placement will aid muscle
				memory.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Full width
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>{`variant="fullWidth"`}</code> prop should be used for smaller views.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FullWidthTabs.js"
					className="my-4"
					iframe={false}
					component={FullWidthTabsComponent}
					raw={FullWidthTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Centered
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>centered</code> prop should be used for larger views.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CenteredTabs.js"
					className="my-4"
					iframe={false}
					component={CenteredTabsComponent}
					raw={CenteredTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Scrollable tabs
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Automatic scroll buttons
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Use the <code>{`variant="scrollable"`}</code> and <code>{`scrollButtons="auto"`}</code> props to display
				left and right scroll buttons on desktop that are hidden on mobile:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ScrollableTabsButtonAuto.js"
					className="my-4"
					iframe={false}
					component={ScrollableTabsButtonAutoComponent}
					raw={ScrollableTabsButtonAutoRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Forced scroll buttons
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Apply <code>{`scrollButtons={true}`}</code> and the <code>allowScrollButtonsMobile</code> prop to
				display the left and right scroll buttons on all viewports:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ScrollableTabsButtonForce.js"
					className="my-4"
					iframe={false}
					component={ScrollableTabsButtonForceComponent}
					raw={ScrollableTabsButtonForceRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you want to make sure the buttons are always visible, you should customize the opacity.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-css"
			>
				{` 
.MuiTabs-scrollButtons.Mui-disabled {
  opacity: 0.3;
}
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ScrollableTabsButtonVisible.js"
					className="my-4"
					iframe={false}
					component={ScrollableTabsButtonVisibleComponent}
					raw={ScrollableTabsButtonVisibleRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Prevent scroll buttons
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Left and right scroll buttons are never be presented with <code>{`scrollButtons={false}`}</code>. All
				scrolling must be initiated through user agent scrolling mechanisms (for example left/right swipe, shift
				mouse wheel, etc.)
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ScrollableTabsButtonPrevent.js"
					className="my-4"
					iframe={false}
					component={ScrollableTabsButtonPreventComponent}
					raw={ScrollableTabsButtonPreventRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Customization
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Here is an example of customizing the component. You can learn more about this in the{' '}
				<a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedTabs.js"
					className="my-4"
					iframe={false}
					component={CustomizedTabsComponent}
					raw={CustomizedTabsRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				🎨 If you are looking for inspiration, you can check{' '}
				<a href="https://mui-treasury.com/?path=/docs/tabs-introduction--docs">
					MUI Treasury&#39;s customization examples
				</a>
				.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Vertical tabs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To make vertical tabs instead of default horizontal ones, there is{' '}
				<code>{`orientation="vertical"`}</code>:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="VerticalTabs.js"
					className="my-4"
					iframe={false}
					component={VerticalTabsComponent}
					raw={VerticalTabsRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Note that you can restore the scrollbar with <code>visibleScrollbar</code>.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Nav tabs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				By default, tabs use a <code>button</code> element, but you can provide your custom tag or component.
				Here&#39;s an example of implementing tabbed navigation:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="NavTabs.js"
					className="my-4"
					iframe={false}
					component={NavTabsComponent}
					raw={NavTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Third-party routing library
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				One frequent use case is to perform navigation on the client only, without an HTTP round-trip to the
				server. The <code>Tab</code> component provides the <code>component</code> prop to handle this use case.
				Here is a <a href="/material-ui/integrations/routing/#tabs">more detailed guide</a>.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Icon tabs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Tab labels may be either all icons or all text.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="IconTabs.js"
					className="my-4"
					iframe={false}
					component={IconTabsComponent}
					raw={IconTabsRaw}
				/>
				<FuseExample
					name="IconLabelTabs.js"
					className="my-4"
					iframe={false}
					component={IconLabelTabsComponent}
					raw={IconLabelTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Icon position
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				By default, the icon is positioned at the <code>top</code> of a tab. Other supported positions are{' '}
				<code>start</code>, <code>end</code>, <code>bottom</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="IconPositionTabs.js"
					className="my-4"
					iframe={false}
					component={IconPositionTabsComponent}
					raw={IconPositionTabsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Accessibility
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				(WAI-ARIA:{' '}
				<a href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/">
					https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
				</a>
				)
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The following steps are needed in order to provide necessary information for assistive technologies:
			</Typography>
			<ol>
				<li>
					Label <code>Tabs</code> via <code>aria-label</code> or <code>aria-labelledby</code>.
				</li>
				<li>
					<code>Tab</code>s need to be connected to their corresponding <code>{`[role="tabpanel"]`}</code> by
					setting the correct <code>id</code>, <code>aria-controls</code> and <code>aria-labelledby</code>.
				</li>
			</ol>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				An example for the current implementation can be found in the demos on this page. We&#39;ve also
				published <a href="#experimental-api">an experimental API</a> in <code>@mui/lab</code> that does not
				require extra work.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Keyboard navigation
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The components implement keyboard navigation using the &quot;manual activation&quot; behavior. If you
				want to switch to the &quot;selection automatically follows focus&quot; behavior you have to pass{' '}
				<code>selectionFollowsFocus</code> to the <code>Tabs</code> component. The WAI-ARIA authoring practices
				have a detailed guide on{' '}
				<a href="https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#x6-4-deciding-when-to-make-selection-automatically-follow-focus">
					how to decide when to make selection automatically follow focus
				</a>
				.
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Demo
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The following two demos only differ in their keyboard navigation behavior. Focus a tab and navigate with
				arrow keys to notice the difference, for example <kbd className="key">Arrow Left</kbd>.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
/* Tabs where selection follows focus */
<Tabs selectionFollowsFocus />
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AccessibleTabs1.js"
					className="my-4"
					iframe={false}
					component={AccessibleTabs1Component}
					raw={AccessibleTabs1Raw}
				/>
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
/* Tabs where each tab needs to be selected manually */
<Tabs />
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AccessibleTabs2.js"
					className="my-4"
					iframe={false}
					component={AccessibleTabs2Component}
					raw={AccessibleTabs2Raw}
				/>
			</Typography>
		</>
	);
}

export default TabsDoc;
