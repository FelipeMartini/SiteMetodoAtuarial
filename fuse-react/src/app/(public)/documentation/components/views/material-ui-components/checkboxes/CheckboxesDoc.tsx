// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckboxesComponent from '../../../ui/material-ui-components/checkboxes/Checkboxes';
import CheckboxesRaw from '../../../ui/material-ui-components/checkboxes/Checkboxes.tsx?raw';
import CheckboxLabelsComponent from '../../../ui/material-ui-components/checkboxes/CheckboxLabels';
import CheckboxLabelsRaw from '../../../ui/material-ui-components/checkboxes/CheckboxLabels.tsx?raw';
import SizeCheckboxesComponent from '../../../ui/material-ui-components/checkboxes/SizeCheckboxes';
import SizeCheckboxesRaw from '../../../ui/material-ui-components/checkboxes/SizeCheckboxes.tsx?raw';
import ColorCheckboxesComponent from '../../../ui/material-ui-components/checkboxes/ColorCheckboxes';
import ColorCheckboxesRaw from '../../../ui/material-ui-components/checkboxes/ColorCheckboxes.tsx?raw';
import IconCheckboxesComponent from '../../../ui/material-ui-components/checkboxes/IconCheckboxes';
import IconCheckboxesRaw from '../../../ui/material-ui-components/checkboxes/IconCheckboxes.tsx?raw';
import ControlledCheckboxComponent from '../../../ui/material-ui-components/checkboxes/ControlledCheckbox';
import ControlledCheckboxRaw from '../../../ui/material-ui-components/checkboxes/ControlledCheckbox.tsx?raw';
import IndeterminateCheckboxComponent from '../../../ui/material-ui-components/checkboxes/IndeterminateCheckbox';
import IndeterminateCheckboxRaw from '../../../ui/material-ui-components/checkboxes/IndeterminateCheckbox.tsx?raw';
import CheckboxesGroupComponent from '../../../ui/material-ui-components/checkboxes/CheckboxesGroup';
import CheckboxesGroupRaw from '../../../ui/material-ui-components/checkboxes/CheckboxesGroup.tsx?raw';
import FormControlLabelPositionComponent from '../../../ui/material-ui-components/checkboxes/FormControlLabelPosition';
import FormControlLabelPositionRaw from '../../../ui/material-ui-components/checkboxes/FormControlLabelPosition.tsx?raw';
import CustomizedCheckboxComponent from '../../../ui/material-ui-components/checkboxes/CustomizedCheckbox';
import CustomizedCheckboxRaw from '../../../ui/material-ui-components/checkboxes/CustomizedCheckbox.tsx?raw';

function CheckboxesDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/checkboxes"
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
				Checkbox
			</Typography>
			<Typography className="description">
				Checkboxes allow the user to select one or more items from a set.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Checkboxes can be used to turn an option on or off.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you have multiple options appearing in a list, you can preserve space by using checkboxes instead of
				on/off switches. If you have a single option, avoid using a checkbox and use an on/off switch instead.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic checkboxes
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Checkboxes.js"
					className="my-4"
					iframe={false}
					component={CheckboxesComponent}
					raw={CheckboxesRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Label
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can provide a label to the <code>Checkbox</code> thanks to the <code>FormControlLabel</code>{' '}
				component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CheckboxLabels.js"
					className="my-4"
					iframe={false}
					component={CheckboxLabelsComponent}
					raw={CheckboxLabelsRaw}
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
				Use the <code>size</code> prop or customize the font size of the svg icons to change the size of the
				checkboxes.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SizeCheckboxes.js"
					className="my-4"
					iframe={false}
					component={SizeCheckboxesComponent}
					raw={SizeCheckboxesRaw}
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
					name="ColorCheckboxes.js"
					className="my-4"
					iframe={false}
					component={ColorCheckboxesComponent}
					raw={ColorCheckboxesRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Icon
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="IconCheckboxes.js"
					className="my-4"
					iframe={false}
					component={IconCheckboxesComponent}
					raw={IconCheckboxesRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Controlled
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can control the checkbox with the <code>checked</code> and <code>onChange</code> props:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ControlledCheckbox.js"
					className="my-4"
					iframe={false}
					component={ControlledCheckboxComponent}
					raw={ControlledCheckboxRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Indeterminate
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A checkbox input can only have two states in a form: checked or unchecked. It either submits its value
				or doesn&#39;t. Visually, there are <strong>three</strong> states a checkbox can be in: checked,
				unchecked, or indeterminate.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can change the indeterminate icon using the <code>indeterminateIcon</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="IndeterminateCheckbox.js"
					className="my-4"
					iframe={false}
					component={IndeterminateCheckboxComponent}
					raw={IndeterminateCheckboxRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning When indeterminate is set, the value of the <code>checked</code> prop only impacts the form
				submitted values. It has no accessibility or UX implications. :::
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				FormGroup
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>FormGroup</code> is a helpful wrapper used to group selection control components.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CheckboxesGroup.js"
					className="my-4"
					iframe={false}
					component={CheckboxesGroupComponent}
					raw={CheckboxesGroupRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Label placement
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can change the placement of the label:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FormControlLabelPosition.js"
					className="my-4"
					iframe={false}
					component={FormControlLabelPositionComponent}
					raw={FormControlLabelPositionRaw}
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
					name="CustomizedCheckbox.js"
					className="my-4"
					iframe={false}
					component={CustomizedCheckboxComponent}
					raw={CustomizedCheckboxRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				🎨 If you are looking for inspiration, you can check{' '}
				<a href="https://mui-treasury.com/?path=/docs/checkbox-introduction--docs">
					MUI Treasury&#39;s customization examples
				</a>
				.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				When to use
			</Typography>
			<ul className="space-y-4">
				<li>
					<a href="https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/">
						Checkboxes vs. Radio Buttons
					</a>
				</li>
				<li>
					<a href="https://uxplanet.org/checkbox-vs-toggle-switch-7fc6e83f10b8">Checkboxes vs. Switches</a>
				</li>
			</ul>
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
				<a href="https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/">
					https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/
				</a>
				)
			</Typography>
			<ul className="space-y-4">
				<li>
					All form controls should have labels, and this includes radio buttons, checkboxes, and switches. In
					most cases, this is done by using the <code>{`<label>`}</code> element (
					<a href="/material-ui/api/form-control-label/">FormControlLabel</a>).
				</li>
				<li>
					When a label can&#39;t be used, it&#39;s necessary to add an attribute directly to the input
					component. In this case, you can apply the additional attribute (for example <code>aria-label</code>
					, <code>aria-labelledby</code>, <code>title</code>) via the <code>inputProps</code> prop.
				</li>
			</ul>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Checkbox
  value="checkedA"
  inputProps={{
    'aria-label': 'Checkbox A',
  
/>
`}
			</FuseHighlight>
		</>
	);
}

export default CheckboxesDoc;
