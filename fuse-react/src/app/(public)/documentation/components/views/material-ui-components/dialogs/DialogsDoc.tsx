// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimpleDialogDemoComponent from '../../../ui/material-ui-components/dialogs/SimpleDialogDemo';
import SimpleDialogDemoRaw from '../../../ui/material-ui-components/dialogs/SimpleDialogDemo.tsx?raw';
import AlertDialogComponent from '../../../ui/material-ui-components/dialogs/AlertDialog';
import AlertDialogRaw from '../../../ui/material-ui-components/dialogs/AlertDialog.tsx?raw';
import AlertDialogSlideComponent from '../../../ui/material-ui-components/dialogs/AlertDialogSlide';
import AlertDialogSlideRaw from '../../../ui/material-ui-components/dialogs/AlertDialogSlide.tsx?raw';
import FormDialogComponent from '../../../ui/material-ui-components/dialogs/FormDialog';
import FormDialogRaw from '../../../ui/material-ui-components/dialogs/FormDialog.tsx?raw';
import CustomizedDialogsComponent from '../../../ui/material-ui-components/dialogs/CustomizedDialogs';
import CustomizedDialogsRaw from '../../../ui/material-ui-components/dialogs/CustomizedDialogs.tsx?raw';
import FullScreenDialogComponent from '../../../ui/material-ui-components/dialogs/FullScreenDialog';
import FullScreenDialogRaw from '../../../ui/material-ui-components/dialogs/FullScreenDialog.tsx?raw';
import MaxWidthDialogComponent from '../../../ui/material-ui-components/dialogs/MaxWidthDialog';
import MaxWidthDialogRaw from '../../../ui/material-ui-components/dialogs/MaxWidthDialog.tsx?raw';
import ResponsiveDialogComponent from '../../../ui/material-ui-components/dialogs/ResponsiveDialog';
import ResponsiveDialogRaw from '../../../ui/material-ui-components/dialogs/ResponsiveDialog.tsx?raw';
import ConfirmationDialogComponent from '../../../ui/material-ui-components/dialogs/ConfirmationDialog';
import ConfirmationDialogRaw from '../../../ui/material-ui-components/dialogs/ConfirmationDialog.tsx?raw';
import CookiesBannerComponent from '../../../ui/material-ui-components/dialogs/CookiesBanner';
import CookiesBannerRaw from '../../../ui/material-ui-components/dialogs/CookiesBanner.tsx?raw';
import DraggableDialogComponent from '../../../ui/material-ui-components/dialogs/DraggableDialog';
import DraggableDialogRaw from '../../../ui/material-ui-components/dialogs/DraggableDialog.tsx?raw';
import ScrollDialogComponent from '../../../ui/material-ui-components/dialogs/ScrollDialog';
import ScrollDialogRaw from '../../../ui/material-ui-components/dialogs/ScrollDialog.tsx?raw';

function DialogsDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/dialogs"
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
				Dialog
			</Typography>
			<Typography className="description">
				Dialogs inform users about a task and can contain critical information, require decisions, or involve
				multiple tasks.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A Dialog is a type of <a href="/material-ui/react-modal/">modal</a> window that appears in front of app
				content to provide critical information or ask for a decision. Dialogs disable all app functionality
				when they appear, and remain on screen until confirmed, dismissed, or a required action has been taken.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Dialogs are purposefully interruptive, so they should be used sparingly.
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
				Dialogs are implemented using a collection of related components:
			</Typography>
			<ul className="space-y-4">
				<li>Dialog: the parent component that renders the modal.</li>
				<li>Dialog Title: a wrapper used for the title of a Dialog.</li>
				<li>Dialog Actions: an optional container for a Dialog&#39;s Buttons.</li>
				<li>Dialog Content: an optional container for displaying the Dialog&#39;s content.</li>
				<li>
					Dialog Content Text: a wrapper for text inside of <code>{`<DialogContent />`}</code>.
				</li>
				<li>
					Slide: optional <a href="/material-ui/transitions/#slide">Transition</a> used to slide the Dialog in
					from the edge of the screen.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleDialogDemo.js"
					className="my-4"
					iframe={false}
					component={SimpleDialogDemoComponent}
					raw={SimpleDialogDemoRaw}
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Alerts
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a situation.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Most alerts don&#39;t need titles. They summarize a decision in a sentence or two by either:
			</Typography>
			<ul className="space-y-4">
				<li>Asking a question (for example &quot;Delete this conversation?&quot;)</li>
				<li>Making a statement related to the action buttons</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Use title bar alerts only for high-risk situations, such as the potential loss of connectivity. Users
				should be able to understand the choices based on the title and button text alone.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If a title is required:
			</Typography>
			<ul className="space-y-4">
				<li>
					Use a clear question or statement with an explanation in the content area, such as &quot;Erase USB
					storage?&quot;.
				</li>
				<li>
					Avoid apologies, ambiguity, or questions, such as &quot;Warning!&quot; or &quot;Are you sure?&quot;
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AlertDialog.js"
					className="my-4"
					iframe={false}
					component={AlertDialogComponent}
					raw={AlertDialogRaw}
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
				You can also swap out the transition, the next example uses <code>Slide</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AlertDialogSlide.js"
					className="my-4"
					iframe={false}
					component={AlertDialogSlideComponent}
					raw={AlertDialogSlideRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Form dialogs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Form dialogs allow users to fill out form fields within a dialog. For example, if your site prompts for
				potential subscribers to fill in their email address, they can fill out the email field and touch
				&#39;Submit&#39;.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FormDialog.js"
					className="my-4"
					iframe={false}
					component={FormDialogComponent}
					raw={FormDialogRaw}
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
				The dialog has a close button added to aid usability.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedDialogs.js"
					className="my-4"
					iframe={false}
					component={CustomizedDialogsComponent}
					raw={CustomizedDialogsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Full-screen dialogs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FullScreenDialog.js"
					className="my-4"
					iframe={false}
					component={FullScreenDialogComponent}
					raw={FullScreenDialogRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Optional sizes
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can set a dialog maximum width by using the <code>maxWidth</code> enumerable in combination with the{' '}
				<code>fullWidth</code> boolean. When the <code>fullWidth</code> prop is true, the dialog will adapt
				based on the <code>maxWidth</code> value.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="MaxWidthDialog.js"
					className="my-4"
					iframe={false}
					component={MaxWidthDialogComponent}
					raw={MaxWidthDialogRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Responsive full-screen
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You may make a dialog responsively full screen using{' '}
				<a href="/material-ui/react-use-media-query/">
					<code>useMediaQuery</code>
				</a>
				.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
import useMediaQuery from '@mui/material/useMediaQuery';

function MyComponent() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return <Dialog fullScreen={fullScreen} />;
}
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ResponsiveDialog.js"
					className="my-4"
					iframe={false}
					component={ResponsiveDialogComponent}
					raw={ResponsiveDialogRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Confirmation dialogs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Confirmation dialogs require users to explicitly confirm their choice before an option is committed. For
				example, users can listen to multiple ringtones but only make a final selection upon touching
				&quot;OK&quot;.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Touching &quot;Cancel&quot; in a confirmation dialog, cancels the action, discards any changes, and
				closes the dialog.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ConfirmationDialog.js"
					className="my-4"
					iframe={false}
					component={ConfirmationDialogComponent}
					raw={ConfirmationDialogRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Non-modal dialog
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Dialogs can also be non-modal, meaning they don&#39;t interrupt user interaction behind it. Visit{' '}
				<a href="https://www.nngroup.com/articles/modal-nonmodal-dialog/">the Nielsen Norman Group article</a>{' '}
				for more in-depth guidance about modal vs. non-modal dialog usage.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The demo below shows a persistent cookie banner, a common non-modal dialog use case.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CookiesBanner.js"
					className="my-4"
					iframe
					component={CookiesBannerComponent}
					raw={CookiesBannerRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Draggable dialog
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can create a draggable dialog by using{' '}
				<a href="https://github.com/react-grid-layout/react-draggable">react-draggable</a>. To do so, you can
				pass the imported <code>Draggable</code> component as the <code>PaperComponent</code> of the{' '}
				<code>Dialog</code> component. This will make the entire dialog draggable.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DraggableDialog.js"
					className="my-4"
					iframe={false}
					component={DraggableDialogComponent}
					raw={DraggableDialogRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Scrolling long content
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				When dialogs become too long for the user&#39;s viewport or device, they scroll.
			</Typography>
			<ul className="space-y-4">
				<li>
					<code>scroll=paper</code> the content of the dialog scrolls within the paper element.
				</li>
				<li>
					<code>scroll=body</code> the content of the dialog scrolls within the body element.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Try the demo below to see what we mean:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ScrollDialog.js"
					className="my-4"
					iframe={false}
					component={ScrollDialogComponent}
					raw={ScrollDialogRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Performance
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Follow the <a href="/material-ui/react-modal/#performance">Modal performance section</a>.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Limitations
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Follow the <a href="/material-ui/react-modal/#limitations">Modal limitations section</a>.
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
				material-ui-confirm
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<img
					src="https://img.shields.io/github/stars/jonatanklosko/material-ui-confirm?style=social&label=Star"
					alt="stars"
				/>
				<img
					src="https://img.shields.io/npm/dm/material-ui-confirm.svg"
					alt="npm downloads"
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The package{' '}
				<a href="https://github.com/jonatanklosko/material-ui-confirm/">
					<code>material-ui-confirm</code>
				</a>{' '}
				provides dialogs for confirming user actions without writing boilerplate code.
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
				Follow the <a href="/material-ui/react-modal/#accessibility">Modal accessibility section</a>.
			</Typography>
		</>
	);
}

export default DialogsDoc;
