// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicTextFieldsComponent from '../../../ui/material-ui-components/text-fields/BasicTextFields';
import BasicTextFieldsRaw from '../../../ui/material-ui-components/text-fields/BasicTextFields.tsx?raw';
import FormPropsTextFieldsComponent from '../../../ui/material-ui-components/text-fields/FormPropsTextFields';
import FormPropsTextFieldsRaw from '../../../ui/material-ui-components/text-fields/FormPropsTextFields.tsx?raw';
import ValidationTextFieldsComponent from '../../../ui/material-ui-components/text-fields/ValidationTextFields';
import ValidationTextFieldsRaw from '../../../ui/material-ui-components/text-fields/ValidationTextFields.tsx?raw';
import MultilineTextFieldsComponent from '../../../ui/material-ui-components/text-fields/MultilineTextFields';
import MultilineTextFieldsRaw from '../../../ui/material-ui-components/text-fields/MultilineTextFields.tsx?raw';
import SelectTextFieldsComponent from '../../../ui/material-ui-components/text-fields/SelectTextFields';
import SelectTextFieldsRaw from '../../../ui/material-ui-components/text-fields/SelectTextFields.tsx?raw';
import InputWithIconComponent from '../../../ui/material-ui-components/text-fields/InputWithIcon';
import InputWithIconRaw from '../../../ui/material-ui-components/text-fields/InputWithIcon.tsx?raw';
import InputAdornmentsComponent from '../../../ui/material-ui-components/text-fields/InputAdornments';
import InputAdornmentsRaw from '../../../ui/material-ui-components/text-fields/InputAdornments.tsx?raw';
import InputSuffixShrinkComponent from '../../../ui/material-ui-components/text-fields/InputSuffixShrink';
import InputSuffixShrinkRaw from '../../../ui/material-ui-components/text-fields/InputSuffixShrink.tsx?raw';
import TextFieldSizesComponent from '../../../ui/material-ui-components/text-fields/TextFieldSizes';
import TextFieldSizesRaw from '../../../ui/material-ui-components/text-fields/TextFieldSizes.tsx?raw';
import TextFieldHiddenLabelComponent from '../../../ui/material-ui-components/text-fields/TextFieldHiddenLabel';
import TextFieldHiddenLabelRaw from '../../../ui/material-ui-components/text-fields/TextFieldHiddenLabel.tsx?raw';
import LayoutTextFieldsComponent from '../../../ui/material-ui-components/text-fields/LayoutTextFields';
import LayoutTextFieldsRaw from '../../../ui/material-ui-components/text-fields/LayoutTextFields.tsx?raw';
import FullWidthTextFieldComponent from '../../../ui/material-ui-components/text-fields/FullWidthTextField';
import FullWidthTextFieldRaw from '../../../ui/material-ui-components/text-fields/FullWidthTextField.tsx?raw';
import StateTextFieldsComponent from '../../../ui/material-ui-components/text-fields/StateTextFields';
import StateTextFieldsRaw from '../../../ui/material-ui-components/text-fields/StateTextFields.tsx?raw';
import ComposedTextFieldComponent from '../../../ui/material-ui-components/text-fields/ComposedTextField';
import ComposedTextFieldRaw from '../../../ui/material-ui-components/text-fields/ComposedTextField.tsx?raw';
import InputsComponent from '../../../ui/material-ui-components/text-fields/Inputs';
import InputsRaw from '../../../ui/material-ui-components/text-fields/Inputs.tsx?raw';
import ColorTextFieldsComponent from '../../../ui/material-ui-components/text-fields/ColorTextFields';
import ColorTextFieldsRaw from '../../../ui/material-ui-components/text-fields/ColorTextFields.tsx?raw';
import CustomizedInputsStyledComponent from '../../../ui/material-ui-components/text-fields/CustomizedInputsStyled';
import CustomizedInputsStyledRaw from '../../../ui/material-ui-components/text-fields/CustomizedInputsStyled.tsx?raw';
import CustomizedInputsStyleOverridesComponent from '../../../ui/material-ui-components/text-fields/CustomizedInputsStyleOverrides';
import CustomizedInputsStyleOverridesRaw from '../../../ui/material-ui-components/text-fields/CustomizedInputsStyleOverrides.tsx?raw';
import CustomizedInputBaseComponent from '../../../ui/material-ui-components/text-fields/CustomizedInputBase';
import CustomizedInputBaseRaw from '../../../ui/material-ui-components/text-fields/CustomizedInputBase.tsx?raw';
import UseFormControlComponent from '../../../ui/material-ui-components/text-fields/UseFormControl';
import UseFormControlRaw from '../../../ui/material-ui-components/text-fields/UseFormControl.tsx?raw';
import HelperTextMisalignedComponent from '../../../ui/material-ui-components/text-fields/HelperTextMisaligned';
import HelperTextMisalignedRaw from '../../../ui/material-ui-components/text-fields/HelperTextMisaligned.tsx?raw';
import HelperTextAlignedComponent from '../../../ui/material-ui-components/text-fields/HelperTextAligned';
import HelperTextAlignedRaw from '../../../ui/material-ui-components/text-fields/HelperTextAligned.tsx?raw';
import FormattedInputsComponent from '../../../ui/material-ui-components/text-fields/FormattedInputs';
import FormattedInputsRaw from '../../../ui/material-ui-components/text-fields/FormattedInputs.tsx?raw';

function TextFieldsDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/text-fields"
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
				Text Field
			</Typography>
			<Typography className="description">Text Fields let users enter and edit text.</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Text fields allow users to enter text into a UI. They typically appear in forms and dialogs.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic TextField
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>TextField</code> wrapper component is a complete form control including a label, input, and
				help text. It comes with three variants: outlined (default), filled, and standard.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicTextFields.js"
					className="my-4"
					iframe={false}
					component={BasicTextFieldsComponent}
					raw={BasicTextFieldsRaw}
				/>
			</Typography>
			<div className="my-3 rounded-xl border-1 p-4">
				<Typography
					className="mb-8 text-base"
					component="div"
				>
					The standard variant of the Text Field is no longer documented in the{' '}
					<a href="https://m2.material.io/">Material Design guidelines</a>(
					<a href="https://medium.com/google-design/the-evolution-of-material-designs-text-fields-603688b3fe03">
						this article explains why
					</a>
					), but Material UI will continue to support it.
				</Typography>
			</div>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Form props
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Standard form attributes are supported, for example <code>required</code>, <code>disabled</code>,{' '}
				<code>type</code>, etc. as well as a <code>helperText</code> which is used to give context about a
				field&#39;s input, such as how the input will be used.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FormPropsTextFields.js"
					className="my-4"
					iframe={false}
					component={FormPropsTextFieldsComponent}
					raw={FormPropsTextFieldsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Controlling the HTML input
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Use <code>slotProps.htmlInput</code> to pass attributes to the underlying <code>{`<input>`}</code>{' '}
				element.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<TextField slotProps={{ htmlInput: { 'data-testid': '…' } }} />
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The rendered HTML input will look like this:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-html"
			>
				{` 
<input
  aria-invalid="false"
  className="MuiInputBase-input MuiOutlinedInput-input"
  type="text"
  data-testid="…"
/>
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning
				<code>slotProps.htmlInput</code> is not the same as <code>slotProps.input</code>.
				<code>slotProps.input</code> refers to the React <code>{`<Input />`}</code> component that&#39;s
				rendered based on the specified variant prop.
				<code>slotProps.htmlInput</code> refers to the HTML <code>{`<input>`}</code> element rendered within
				that Input component, regardless of the variant. :::
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Validation
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>error</code> prop toggles the error state. The <code>helperText</code> prop can then be used
				to provide feedback to the user about the error.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ValidationTextFields.js"
					className="my-4"
					iframe={false}
					component={ValidationTextFieldsComponent}
					raw={ValidationTextFieldsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Multiline
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>multiline</code> prop transforms the Text Field into a{' '}
				<a href="https://v6.mui.com/base-ui/react-textarea-autosize/">MUI Base Textarea Autosize</a> element.
				Unless the <code>rows</code> prop is set, the height of the text field dynamically matches its content.
				You can use the <code>minRows</code> and <code>maxRows</code> props to bound it.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="MultilineTextFields.js"
					className="my-4"
					iframe={false}
					component={MultilineTextFieldsComponent}
					raw={MultilineTextFieldsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Select
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>select</code> prop makes the text field use the{' '}
				<a href="/material-ui/react-select/">Select</a> component internally.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SelectTextFields.js"
					className="my-4"
					iframe={false}
					component={SelectTextFieldsComponent}
					raw={SelectTextFieldsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Icons
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				There are multiple ways to display an icon with a text field.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="InputWithIcon.js"
					className="my-4"
					iframe={false}
					component={InputWithIconComponent}
					raw={InputWithIconRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Input Adornments
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The main way is with an <code>InputAdornment</code>. This can be used to add a prefix, a suffix, or an
				action to an input. For instance, you can use an icon button to hide or reveal the password.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="InputAdornments.js"
					className="my-4"
					iframe={false}
					component={InputAdornmentsComponent}
					raw={InputAdornmentsRaw}
				/>
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Customizing adornments
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can apply custom styles to adornments, and trigger changes to one based on attributes from another.
				For example, the demo below uses the label&#39;s <code>[data-shrink=true]</code> attribute to make the
				suffix visible (via opacity) when the label is in its shrunken state.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="InputSuffixShrink.js"
					className="my-4"
					iframe={false}
					component={InputSuffixShrinkComponent}
					raw={InputSuffixShrinkRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Sizes
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Fancy smaller inputs? Use the <code>size</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TextFieldSizes.js"
					className="my-4"
					iframe={false}
					component={TextFieldSizesComponent}
					raw={TextFieldSizesRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>filled</code> variant input height can be further reduced by rendering the label outside of
				it.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TextFieldHiddenLabel.js"
					className="my-4"
					iframe={false}
					component={TextFieldHiddenLabelComponent}
					raw={TextFieldHiddenLabelRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Margin
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>margin</code> prop can be used to alter the vertical spacing of the text field. Using{' '}
				<code>none</code> (default) doesn&#39;t apply margins to the <code>FormControl</code> whereas{' '}
				<code>dense</code> and <code>normal</code> do.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="LayoutTextFields.js"
					className="my-4"
					iframe={false}
					component={LayoutTextFieldsComponent}
					raw={LayoutTextFieldsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Full width
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>fullWidth</code> can be used to make the input take up the full width of its container.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FullWidthTextField.js"
					className="my-4"
					iframe={false}
					component={FullWidthTextFieldComponent}
					raw={FullWidthTextFieldRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Uncontrolled vs. Controlled
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The component can be controlled or uncontrolled.
			</Typography>
			<div className="my-3 rounded-xl border-1 p-4">
				<ul className="space-y-4">
					<li>
						A component is <strong>controlled</strong> when it&#39;s managed by its parent using props.
					</li>
					<li>
						A component is <strong>uncontrolled</strong> when it&#39;s managed by its own local state.
					</li>
				</ul>
				<Typography
					className="mb-8 text-base"
					component="div"
				>
					Learn more about controlled and uncontrolled components in the{' '}
					<a href="https://react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components">
						React documentation
					</a>
					.
				</Typography>
			</div>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="StateTextFields.js"
					className="my-4"
					iframe={false}
					component={StateTextFieldsComponent}
					raw={StateTextFieldsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Components
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>TextField</code> is composed of smaller components (
				<a href="/material-ui/api/form-control/">
					<code>FormControl</code>
				</a>
				,
				<a href="/material-ui/api/input/">
					<code>Input</code>
				</a>
				,
				<a href="/material-ui/api/filled-input/">
					<code>FilledInput</code>
				</a>
				,
				<a href="/material-ui/api/input-label/">
					<code>InputLabel</code>
				</a>
				,
				<a href="/material-ui/api/outlined-input/">
					<code>OutlinedInput</code>
				</a>
				, and{' '}
				<a href="/material-ui/api/form-helper-text/">
					<code>FormHelperText</code>
				</a>
				) that you can leverage directly to significantly customize your form inputs.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You might also have noticed that some native HTML input properties are missing from the{' '}
				<code>TextField</code> component. This is on purpose. The component takes care of the most used
				properties. Then, it&#39;s up to the user to use the underlying component shown in the following demo.
				Still, you can use <code>slotProps.htmlInput</code> (and <code>slotProps.input</code>,{' '}
				<code>slotProps.inputLabel</code> properties) if you want to avoid some boilerplate.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ComposedTextField.js"
					className="my-4"
					iframe={false}
					component={ComposedTextFieldComponent}
					raw={ComposedTextFieldRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Inputs
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Inputs.js"
					className="my-4"
					iframe={false}
					component={InputsComponent}
					raw={InputsRaw}
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
				The <code>color</code> prop changes the highlight color of the text field when focused.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColorTextFields.js"
					className="my-4"
					iframe={false}
					component={ColorTextFieldsComponent}
					raw={ColorTextFieldsRaw}
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
				Here are some examples of customizing the component. You can learn more about this in the{' '}
				<a href="/material-ui/customization/how-to-customize/">overrides documentation page</a>.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Using the styled API
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedInputsStyled.js"
					className="my-4"
					iframe={false}
					component={CustomizedInputsStyledComponent}
					raw={CustomizedInputsStyledRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Using the theme style overrides API
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Use the <code>styleOverrides</code> key to change any style injected by Material UI into the DOM. See
				the{' '}
				<a href="/material-ui/customization/theme-components/#theme-style-overrides">theme style overrides</a>{' '}
				documentation for further details.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedInputsStyleOverrides.js"
					className="my-4"
					iframe={false}
					component={CustomizedInputsStyleOverridesComponent}
					raw={CustomizedInputsStyleOverridesRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Customization does not stop at CSS. You can use composition to build custom components and give your app
				a unique feel. Below is an example using the{' '}
				<a href="/material-ui/api/input-base/">
					<code>InputBase</code>
				</a>{' '}
				component, inspired by Google Maps.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedInputBase.js"
					className="my-4"
					iframe={false}
					component={CustomizedInputBaseComponent}
					raw={CustomizedInputBaseRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				🎨 If you are looking for inspiration, you can check{' '}
				<a href="https://mui-treasury.com/?path=/docs/textField-introduction--docs">
					MUI Treasury&#39;s customization examples
				</a>
				.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				<code>useFormControl</code>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For advanced customization use cases, a <code>useFormControl()</code> hook is exposed. This hook returns
				the context value of the parent <code>FormControl</code> component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<strong>API</strong>
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
import { useFormControl } from '@mui/material/FormControl';
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<strong>Returns</strong>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>value</code> (<em>object</em>):
			</Typography>
			<ul className="space-y-4">
				<li>
					<code>value.adornedStart</code> (<em>bool</em>): Indicate whether the child <code>Input</code> or{' '}
					<code>Select</code> component has a start adornment.
				</li>
				<li>
					<code>value.setAdornedStart</code> (<em>func</em>): Setter function for <code>adornedStart</code>{' '}
					state value.
				</li>
				<li>
					<code>value.color</code> (<em>string</em>): The theme color is being used, inherited from{' '}
					<code>FormControl</code> <code>color</code> prop .
				</li>
				<li>
					<code>value.disabled</code> (<em>bool</em>): Indicate whether the component is being displayed in a
					disabled state, inherited from <code>FormControl</code> <code>disabled</code> prop.
				</li>
				<li>
					<code>value.error</code> (<em>bool</em>): Indicate whether the component is being displayed in an
					error state, inherited from <code>FormControl</code> <code>error</code> prop
				</li>
				<li>
					<code>value.filled</code> (<em>bool</em>): Indicate whether input is filled
				</li>
				<li>
					<code>value.focused</code> (<em>bool</em>): Indicate whether the component and its children are
					being displayed in a focused state
				</li>
				<li>
					<code>value.fullWidth</code> (<em>bool</em>): Indicate whether the component is taking up the full
					width of its container, inherited from <code>FormControl</code> <code>fullWidth</code> prop
				</li>
				<li>
					<code>value.hiddenLabel</code> (<em>bool</em>): Indicate whether the label is being hidden,
					inherited from <code>FormControl</code> <code>hiddenLabel</code> prop
				</li>
				<li>
					<code>value.required</code> (<em>bool</em>): Indicate whether the label is indicating that the input
					is required input, inherited from the <code>FormControl</code> <code>required</code> prop
				</li>
				<li>
					<code>value.size</code> (<em>string</em>): The size of the component, inherited from the{' '}
					<code>FormControl</code> <code>size</code> prop
				</li>
				<li>
					<code>value.variant</code> (<em>string</em>): The variant is being used by the{' '}
					<code>FormControl</code> component and its children, inherited from <code>FormControl</code>{' '}
					<code>variant</code> prop
				</li>
				<li>
					<code>value.onBlur</code> (<em>func</em>): Should be called when the input is blurred
				</li>
				<li>
					<code>value.onFocus</code> (<em>func</em>): Should be called when the input is focused
				</li>
				<li>
					<code>value.onEmpty</code> (<em>func</em>): Should be called when the input is emptied
				</li>
				<li>
					<code>value.onFilled</code> (<em>func</em>): Should be called when the input is filled
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<strong>Example</strong>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="UseFormControl.js"
					className="my-4"
					iframe={false}
					component={UseFormControlComponent}
					raw={UseFormControlRaw}
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
				Global styles for the auto-fill keyframes are injected and removed on each mount and unmount,
				respectively. If you are loading a large number of Text Field components at once, it might be a good
				idea to change this default behavior by enabling{' '}
				<a href="/material-ui/api/input-base/#input-base-prop-disableInjectingGlobalStyles">
					<code>disableInjectingGlobalStyles</code>
				</a>{' '}
				in <code>MuiInputBase</code>. Make sure to inject <code>GlobalStyles</code> for the auto-fill keyframes
				at the top of your application.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
import { GlobalStyles, createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  components: {
    MuiInputBase: {
      defaultProps: {
        disableInjectingGlobalStyles: true,
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles
        styles={{
          '@keyframes mui-auto-fill': { from: { display: 'block' } },
          '@keyframes mui-auto-fill-cancel': { from: { display: 'block' } },
        
      />
      ...
    </ThemeProvider>
  );
}
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Limitations
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Shrink
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The input label &quot;shrink&quot; state isn&#39;t always correct. The input label is supposed to shrink
				as soon as the input is displaying something. In some circumstances, we can&#39;t determine the
				&quot;shrink&quot; state (datetime input, Stripe input). You might notice an overlap.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<img
					src="/material-ui-static/images/text-fields/shrink.png"
					alt="shrink"
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To workaround the issue, you can force the &quot;shrink&quot; state of the label.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<TextField slotProps={{ inputLabel: { shrink: true } }} />
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				or
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<InputLabel shrink>Count</InputLabel>
`}
			</FuseHighlight>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Floating label
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The floating label is absolutely positioned. It won&#39;t impact the layout of the page. Make sure that
				the input is larger than the label to display correctly.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				type=&quot;number&quot;
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning We do not recommend using <code>{`type="number"`}</code> with a Text Field due to potential
				usability issues:
			</Typography>
			<ul className="space-y-4">
				<li>
					<Typography
						className="mb-8 text-base"
						component="div"
					>
						it allows certain non-numeric characters (&#39;e&#39;, &#39;+&#39;, &#39;-&#39;, &#39;.&#39;)
						and silently discards others
					</Typography>
				</li>
				<li>
					<Typography
						className="mb-8 text-base"
						component="div"
					>
						the functionality of scrolling to increment/decrement the number can cause accidental and
						hard-to-notice changes
					</Typography>
				</li>
				<li>
					<Typography
						className="mb-8 text-base"
						component="div"
					>
						and more—see{' '}
						<a href="https://technology.blog.gov.uk/2020/02/24/why-the-gov-uk-design-system-team-changed-the-input-type-for-numbers/">
							Why the GOV.UK Design System team changed the input type for numbers
						</a>{' '}
						for a more detailed explanation of the limitations of <code>{`<input type="number">`}</code>
					</Typography>
					<Typography
						className="mb-8 text-base"
						component="div"
					>
						:::
					</Typography>
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you need a text field with number validation, you can use MUI Base&#39;s{' '}
				<a href="https://mui.com/base-ui/react-number-input/">Number Input</a> instead.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can follow <a href="https://github.com/mui/material-ui/issues/19154">this GitHub issue</a> to track
				the progress of introducing the Number Input component to Material UI.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Helper text
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The helper text prop affects the height of the text field. If two text fields are placed side by side,
				one with a helper text and one without, they will have different heights. For example:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="HelperTextMisaligned.js"
					className="my-4"
					iframe={false}
					component={HelperTextMisalignedComponent}
					raw={HelperTextMisalignedRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This can be fixed by passing a space character to the <code>helperText</code> prop:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="HelperTextAligned.js"
					className="my-4"
					iframe={false}
					component={HelperTextAlignedComponent}
					raw={HelperTextAlignedRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Integration with 3rd party input libraries
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use third-party libraries to format an input. You have to provide a custom implementation of the{' '}
				<code>{`<input>`}</code> element with the <code>inputComponent</code> property.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The following demo uses the <a href="https://github.com/uNmAnNeR/imaskjs">react-imask</a> and{' '}
				<a href="https://github.com/s-yadav/react-number-format">react-number-format</a> libraries. The same
				concept could be applied to, for example{' '}
				<a href="https://github.com/mui/material-ui/issues/16037">react-stripe-element</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FormattedInputs.js"
					className="my-4"
					iframe={false}
					component={FormattedInputsComponent}
					raw={FormattedInputsRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The provided input component should expose a ref with a value that implements the following interface:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-ts"
			>
				{` 
interface InputElement {
  focus(): void;
  value?: string;
}
`}
			</FuseHighlight>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
const MyInputComponent = React.forwardRef((props, ref) => {
  const { component: Component, ...other } = props;

  // implement \`InputElement\` interface
  React.useImperativeHandle(ref, () => ({
    focus: () => {
      // logic to focus the rendered component from 3rd party belongs here
    },
    // hiding the value e.g. react-stripe-elements
  }));

  // \`Component\` will be your \`SomeThirdPartyComponent\` from below
  return <Component {...other} />;
});

// usage
<TextField
  slotProps={{
    input: {
      inputComponent: MyInputComponent,
      inputProps: {
        component: SomeThirdPartyComponent,
      },
    },
  
/>;
`}
			</FuseHighlight>
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
				In order for the text field to be accessible,{' '}
				<strong>the input should be linked to the label and the helper text</strong>. The underlying DOM nodes
				should have this structure:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<div className="form-control">
  <label for="my-input">Email address</label>
  <input id="my-input" aria-describedby="my-helper-text" />
  <span id="my-helper-text">We'll never share your email.</span>
</div>
`}
			</FuseHighlight>
			<ul className="space-y-4">
				<li>
					If you are using the <code>TextField</code> component, you just have to provide a unique{' '}
					<code>id</code> unless you&#39;re using the <code>TextField</code> only client-side. Until the UI is
					hydrated <code>TextField</code> without an explicit <code>id</code> will not have associated labels.
				</li>
				<li>If you are composing the component:</li>
			</ul>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<FormControl>
  <InputLabel htmlFor="my-input">Email address</InputLabel>
  <Input id="my-input" aria-describedby="my-helper-text" />
  <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText>
</FormControl>
`}
			</FuseHighlight>
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
				For more advanced use cases, you might be able to take advantage of:
			</Typography>
			<ul className="space-y-4">
				<li>
					<a href="https://github.com/dohomi/react-hook-form-mui">react-hook-form-mui</a>: Material UI and{' '}
					<a href="https://react-hook-form.com/">react-hook-form</a> combined.
				</li>
				<li>
					<a href="https://github.com/stackworx/formik-mui">formik-material-ui</a>: Bindings for using
					Material UI with <a href="https://formik.org/">formik</a>.
				</li>
				<li>
					<a href="https://github.com/lookfirst/mui-rff">mui-rff</a>: Bindings for using Material UI with{' '}
					<a href="https://final-form.org/react">React Final Form</a>.
				</li>
				<li>
					<a href="https://www.npmjs.com/package/@ui-schema/ds-material">@ui-schema/ds-material</a> Bindings
					for using Material UI with <a href="https://github.com/ui-schema/ui-schema">UI Schema</a>. JSON
					Schema compatible.
				</li>
			</ul>
		</>
	);
}

export default TextFieldsDoc;
