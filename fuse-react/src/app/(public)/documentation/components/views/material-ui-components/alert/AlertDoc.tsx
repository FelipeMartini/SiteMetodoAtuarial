// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimpleAlertComponent from '../../../ui/material-ui-components/alert/SimpleAlert';
import SimpleAlertRaw from '../../../ui/material-ui-components/alert/SimpleAlert.tsx?raw';
import BasicAlertsComponent from '../../../ui/material-ui-components/alert/BasicAlerts';
import BasicAlertsRaw from '../../../ui/material-ui-components/alert/BasicAlerts.tsx?raw';
import FilledAlertsComponent from '../../../ui/material-ui-components/alert/FilledAlerts';
import FilledAlertsRaw from '../../../ui/material-ui-components/alert/FilledAlerts.tsx?raw';
import OutlinedAlertsComponent from '../../../ui/material-ui-components/alert/OutlinedAlerts';
import OutlinedAlertsRaw from '../../../ui/material-ui-components/alert/OutlinedAlerts.tsx?raw';
import ColorAlertsComponent from '../../../ui/material-ui-components/alert/ColorAlerts';
import ColorAlertsRaw from '../../../ui/material-ui-components/alert/ColorAlerts.tsx?raw';
import ActionAlertsComponent from '../../../ui/material-ui-components/alert/ActionAlerts';
import ActionAlertsRaw from '../../../ui/material-ui-components/alert/ActionAlerts.tsx?raw';
import IconAlertsComponent from '../../../ui/material-ui-components/alert/IconAlerts';
import IconAlertsRaw from '../../../ui/material-ui-components/alert/IconAlerts.tsx?raw';
import DescriptionAlertsComponent from '../../../ui/material-ui-components/alert/DescriptionAlerts';
import DescriptionAlertsRaw from '../../../ui/material-ui-components/alert/DescriptionAlerts.tsx?raw';
import TransitionAlertsComponent from '../../../ui/material-ui-components/alert/TransitionAlerts';
import TransitionAlertsRaw from '../../../ui/material-ui-components/alert/TransitionAlerts.tsx?raw';

function AlertDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/alert"
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
				Alert
			</Typography>
			<Typography className="description">
				Alerts display brief messages for the user without interrupting their use of the app.
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
				Alerts give users brief and potentially time-sensitive information in an unobtrusive manner.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Material UI Alert component includes several props for quickly customizing its styles to provide
				immediate visual cues about its contents.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleAlert.js"
					className="my-4"
					iframe={false}
					component={SimpleAlertComponent}
					raw={SimpleAlertRaw}
				/>
			</Typography>
			<div className="my-3 rounded-xl border-1 p-4">
				<Typography
					className="mb-8 text-base"
					component="div"
				>
					This component is no longer documented in the{' '}
					<a href="https://m2.material.io/">Material Design guidelines</a>, but Material UI will continue to
					support it.
				</Typography>
			</div>

			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Usage
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A key trait of the alert pattern is that{' '}
				<a href="https://www.w3.org/WAI/ARIA/apg/patterns/alert/">
					it should not interrupt the user&#39;s experience
				</a>{' '}
				of the app. Alerts should not be confused with alert <em>dialogs</em> (
				<a href="https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/">ARIA</a>), which <em>are</em> intended
				to interrupt the user to obtain a response. Use the Material UI{' '}
				<a href="/material-ui/react-dialog/">Dialog</a> component if you need this behavior.
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
import Alert from '@mui/material/Alert';
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Alert component wraps around its content, and stretches to fill its enclosing container.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Severity
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>severity</code> prop accepts four values representing different states—
				<code>success</code> (the default), <code>info</code>, <code>warning</code>, and <code>error</code>–with
				corresponding icon and color combinations for each:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicAlerts.js"
					className="my-4"
					iframe={false}
					component={BasicAlertsComponent}
					raw={BasicAlertsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Variants
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Alert component comes with two alternative style options—<code>filled</code> and{' '}
				<code>outlined</code>—which you can set using the <code>variant</code> prop.
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Filled
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FilledAlerts.js"
					className="my-4"
					iframe={false}
					component={FilledAlertsComponent}
					raw={FilledAlertsRaw}
				/>
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Outlined
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="OutlinedAlerts.js"
					className="my-4"
					iframe={false}
					component={OutlinedAlertsComponent}
					raw={OutlinedAlertsRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning When using an outlined Alert with the <a href="/material-ui/react-snackbar/">Snackbar</a>{' '}
				component, background content will be visible and bleed through the Alert by default. You can prevent
				this by adding <code>{`bgcolor: 'background.paper'`}</code> to{' '}
				<a href="/material-ui/customization/how-to-customize/#the-sx-prop">
					the <code>sx</code> prop
				</a>{' '}
				on the Alert component:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Alert sx={{ bgcolor: 'background.paper' }} />
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Check out the <a href="/material-ui/react-snackbar/#customization">Snackbar—customization</a> doc for an
				example of how to use these two components together. :::
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Color
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Use the <code>color</code> prop to override the default color for the specified{' '}
				<a href="#severity">
					<code>severity</code>
				</a>
				—for instance, to apply <code>warning</code> colors to a <code>success</code> Alert:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColorAlerts.js"
					className="my-4"
					iframe={false}
					component={ColorAlertsComponent}
					raw={ColorAlertsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Actions
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Add an action to your Alert with the <code>action</code> prop. This lets you insert any element—an HTML
				tag, an SVG icon, or a React component such as a Material UI Button—after the Alert&#39;s message,
				justified to the right.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you provide an <code>onClose</code> callback to the Alert without setting the <code>action</code>{' '}
				prop, the component will display a close icon (&#x2715;) by default.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ActionAlerts.js"
					className="my-4"
					iframe={false}
					component={ActionAlertsComponent}
					raw={ActionAlertsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Icons
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Use the <code>icon</code> prop to override an Alert&#39;s icon. As with the{' '}
				<a href="#actions">
					<code>action</code>
				</a>{' '}
				prop, your <code>icon</code> can be an HTML element, an SVG icon, or a React component. Set this prop to{' '}
				<code>false</code> to remove the icon altogether.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you need to override all instances of an icon for a given{' '}
				<a href="#severity">
					<code>severity</code>
				</a>
				, you can use the <code>iconMapping</code> prop instead. You can define this prop globally by
				customizing your app&#39;s theme. See{' '}
				<a href="/material-ui/customization/theme-components/#theme-default-props">
					Theme components—Default props
				</a>{' '}
				for details.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="IconAlerts.js"
					className="my-4"
					iframe={false}
					component={IconAlertsComponent}
					raw={IconAlertsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Customization
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Titles
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To add a title to an Alert, import the Alert Title component:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
import AlertTitle from '@mui/material/AlertTitle';
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can nest this component above the message in your Alert for a neatly styled and properly aligned
				title, as shown below:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DescriptionAlerts.js"
					className="my-4"
					iframe={false}
					component={DescriptionAlertsComponent}
					raw={DescriptionAlertsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Transitions
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use <a href="/material-ui/transitions/">Transition components</a> like{' '}
				<a href="/material-ui/transitions/#collapse">Collapse</a> to add motion to an Alert&#39;s entrance and
				exit.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TransitionAlerts.js"
					className="my-4"
					iframe={false}
					component={TransitionAlertsComponent}
					raw={TransitionAlertsRaw}
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
				Here are some factors to consider to ensure that your Alert is accessible:
			</Typography>
			<ul className="space-y-4">
				<li>
					Because alerts are not intended to interfere with the use of the app, your Alert component should{' '}
					<em>never</em> affect the keyboard focus.
				</li>
				<li>
					If an alert contains an action, that action must have a <code>tabindex</code> of <code>0</code> so
					it can be reached by keyboard-only users.
				</li>
				<li>
					Essential alerts should not disappear automatically—
					<a href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-no-exceptions.html">
						timed interactions
					</a>{' '}
					can make your app inaccessible to users who need extra time to understand or locate the alert.
				</li>
				<li>
					Alerts that occur too frequently can{' '}
					<a href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/time-limits-postponed.html">
						inhibit the usability
					</a>{' '}
					of your app.
				</li>
				<li>
					Dynamically rendered alerts are announced by screen readers; alerts that are already present on the
					page when it loads are <em>not</em> announced.
				</li>
				<li>
					Color does not add meaning to the UI for users who require assistive technology. You must ensure
					that any information conveyed through color is also denoted in other ways, such as within the text
					of the alert itself, or with additional hidden text that&#39;s read by screen readers.
				</li>
			</ul>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Anatomy
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Alert component is composed of a root <a href="/material-ui/react-paper/">Paper</a> component (which
				renders as a <code>{`<div>`}</code>) that houses an icon, a message, and an optional{' '}
				<a href="#actions">action</a>:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-html"
			>
				{` 
<div className="MuiPaper-root MuiAlert-root" role="alert">
  <div className="MuiAlert-icon">
    
  </div>
  <div className="MuiAlert-message">This is how an Alert renders in the DOM.</div>
  <div className="MuiAlert-action">
    
  </div>
</div>
`}
			</FuseHighlight>
		</>
	);
}

export default AlertDoc;
