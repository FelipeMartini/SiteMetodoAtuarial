// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ToggleButtonsComponent from '../../../ui/material-ui-components/toggle-button/ToggleButtons';
import ToggleButtonsRaw from '../../../ui/material-ui-components/toggle-button/ToggleButtons.tsx?raw';
import ToggleButtonsMultipleComponent from '../../../ui/material-ui-components/toggle-button/ToggleButtonsMultiple';
import ToggleButtonsMultipleRaw from '../../../ui/material-ui-components/toggle-button/ToggleButtonsMultiple.tsx?raw';
import ToggleButtonSizesComponent from '../../../ui/material-ui-components/toggle-button/ToggleButtonSizes';
import ToggleButtonSizesRaw from '../../../ui/material-ui-components/toggle-button/ToggleButtonSizes.tsx?raw';
import ColorToggleButtonComponent from '../../../ui/material-ui-components/toggle-button/ColorToggleButton';
import ColorToggleButtonRaw from '../../../ui/material-ui-components/toggle-button/ColorToggleButton.tsx?raw';
import VerticalToggleButtonsComponent from '../../../ui/material-ui-components/toggle-button/VerticalToggleButtons';
import VerticalToggleButtonsRaw from '../../../ui/material-ui-components/toggle-button/VerticalToggleButtons.tsx?raw';
import ToggleButtonNotEmptyComponent from '../../../ui/material-ui-components/toggle-button/ToggleButtonNotEmpty';
import ToggleButtonNotEmptyRaw from '../../../ui/material-ui-components/toggle-button/ToggleButtonNotEmpty.tsx?raw';
import StandaloneToggleButtonComponent from '../../../ui/material-ui-components/toggle-button/StandaloneToggleButton';
import StandaloneToggleButtonRaw from '../../../ui/material-ui-components/toggle-button/StandaloneToggleButton.tsx?raw';
import CustomizedDividersComponent from '../../../ui/material-ui-components/toggle-button/CustomizedDividers';
import CustomizedDividersRaw from '../../../ui/material-ui-components/toggle-button/CustomizedDividers.tsx?raw';
import HorizontalSpacingToggleButtonComponent from '../../../ui/material-ui-components/toggle-button/HorizontalSpacingToggleButton';
import HorizontalSpacingToggleButtonRaw from '../../../ui/material-ui-components/toggle-button/HorizontalSpacingToggleButton.tsx?raw';
import VerticalSpacingToggleButtonComponent from '../../../ui/material-ui-components/toggle-button/VerticalSpacingToggleButton';
import VerticalSpacingToggleButtonRaw from '../../../ui/material-ui-components/toggle-button/VerticalSpacingToggleButton.tsx?raw';

function ToggleButtonDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/toggle-button"
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
				Toggle Button
			</Typography>
			<Typography className="description">A Toggle Button can be used to group related options.</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To emphasize groups of related Toggle buttons, a group should share a common container. The{' '}
				<code>ToggleButtonGroup</code> controls the selected state of its child buttons when given its own{' '}
				<code>value</code> prop.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Exclusive selection
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				With exclusive selection, selecting one option deselects any other.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In this example, text justification toggle buttons present options for left, center, right, and fully
				justified text (disabled), with only one item available for selection at a time.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<strong>Note</strong>: Exclusive selection does not enforce that a button must be active. For that
				effect see <a href="#enforce-value-set">enforce value set</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ToggleButtons.js"
					className="my-4"
					iframe={false}
					component={ToggleButtonsComponent}
					raw={ToggleButtonsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Multiple selection
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Multiple selection allows for logically-grouped options, like bold, italic, and underline, to have
				multiple options selected.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ToggleButtonsMultiple.js"
					className="my-4"
					iframe={false}
					component={ToggleButtonsMultipleComponent}
					raw={ToggleButtonsMultipleRaw}
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
				For larger or smaller buttons, use the <code>size</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ToggleButtonSizes.js"
					className="my-4"
					iframe={false}
					component={ToggleButtonSizesComponent}
					raw={ToggleButtonSizesRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Color
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColorToggleButton.js"
					className="my-4"
					iframe={false}
					component={ColorToggleButtonComponent}
					raw={ColorToggleButtonRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Vertical buttons
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The buttons can be stacked vertically with the <code>orientation</code> prop set to
				&quot;vertical&quot;.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="VerticalToggleButtons.js"
					className="my-4"
					iframe={false}
					component={VerticalToggleButtonsComponent}
					raw={VerticalToggleButtonsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Enforce value set
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you want to enforce that at least one button must be active, you can adapt your handleChange
				function.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
const handleAlignment = (event, newAlignment) => {
  if (newAlignment !== null) {
    setAlignment(newAlignment);
  }
};

const handleDevices = (event, newDevices) => {
  if (newDevices.length) {
    setDevices(newDevices);
  }
};
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ToggleButtonNotEmpty.js"
					className="my-4"
					iframe={false}
					component={ToggleButtonNotEmptyComponent}
					raw={ToggleButtonNotEmptyRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Standalone toggle button
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="StandaloneToggleButton.js"
					className="my-4"
					iframe={false}
					component={StandaloneToggleButtonComponent}
					raw={StandaloneToggleButtonRaw}
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
					name="CustomizedDividers.js"
					className="my-4"
					iframe={false}
					component={CustomizedDividersComponent}
					raw={CustomizedDividersRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Spacing
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The demos below show how to adjust spacing between toggle buttons in horizontal and vertical
				orientations.
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Horizontal Spacing
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="HorizontalSpacingToggleButton.js"
					className="my-4"
					iframe={false}
					component={HorizontalSpacingToggleButtonComponent}
					raw={HorizontalSpacingToggleButtonRaw}
				/>
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Vertical Spacing
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="VerticalSpacingToggleButton.js"
					className="my-4"
					iframe={false}
					component={VerticalSpacingToggleButtonComponent}
					raw={VerticalSpacingToggleButtonRaw}
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
			<ul className="space-y-4">
				<li>
					ToggleButtonGroup has <code>{`role="group"`}</code>. You should provide an accessible label with{' '}
					<code>{`aria-label="label"`}</code>, <code>{`aria-labelledby="id"`}</code> or{' '}
					<code>{`<label>`}</code>.
				</li>
				<li>
					ToggleButton sets <code>{`aria-pressed="<bool>"`}</code> according to the button state. You should
					label each button with <code>aria-label</code>.
				</li>
			</ul>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Keyboard
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				At present, toggle buttons are in DOM order. Navigate between them with the tab key. The button behavior
				follows standard keyboard semantics.
			</Typography>
		</>
	);
}

export default ToggleButtonDoc;
