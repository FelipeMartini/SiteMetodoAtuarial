// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PlaygroundComponent from '../../../ui/material-ui-components/autocomplete/Playground';
import PlaygroundRaw from '../../../ui/material-ui-components/autocomplete/Playground.tsx?raw';
import CountrySelectComponent from '../../../ui/material-ui-components/autocomplete/CountrySelect';
import CountrySelectRaw from '../../../ui/material-ui-components/autocomplete/CountrySelect.tsx?raw';
import ControllableStatesComponent from '../../../ui/material-ui-components/autocomplete/ControllableStates';
import ControllableStatesRaw from '../../../ui/material-ui-components/autocomplete/ControllableStates.tsx?raw';
import FreeSoloComponent from '../../../ui/material-ui-components/autocomplete/FreeSolo';
import FreeSoloRaw from '../../../ui/material-ui-components/autocomplete/FreeSolo.tsx?raw';
import FreeSoloCreateOptionComponent from '../../../ui/material-ui-components/autocomplete/FreeSoloCreateOption';
import FreeSoloCreateOptionRaw from '../../../ui/material-ui-components/autocomplete/FreeSoloCreateOption.tsx?raw';
import FreeSoloCreateOptionDialogComponent from '../../../ui/material-ui-components/autocomplete/FreeSoloCreateOptionDialog';
import FreeSoloCreateOptionDialogRaw from '../../../ui/material-ui-components/autocomplete/FreeSoloCreateOptionDialog.tsx?raw';
import GroupedComponent from '../../../ui/material-ui-components/autocomplete/Grouped';
import GroupedRaw from '../../../ui/material-ui-components/autocomplete/Grouped.tsx?raw';
import RenderGroupComponent from '../../../ui/material-ui-components/autocomplete/RenderGroup';
import RenderGroupRaw from '../../../ui/material-ui-components/autocomplete/RenderGroup.tsx?raw';
import DisabledOptionsComponent from '../../../ui/material-ui-components/autocomplete/DisabledOptions';
import DisabledOptionsRaw from '../../../ui/material-ui-components/autocomplete/DisabledOptions.tsx?raw';
import UseAutocompleteComponent from '../../../ui/material-ui-components/autocomplete/UseAutocomplete';
import UseAutocompleteRaw from '../../../ui/material-ui-components/autocomplete/UseAutocomplete.tsx?raw';
import CustomizedHookComponent from '../../../ui/material-ui-components/autocomplete/CustomizedHook';
import CustomizedHookRaw from '../../../ui/material-ui-components/autocomplete/CustomizedHook.tsx?raw';
import AsynchronousComponent from '../../../ui/material-ui-components/autocomplete/Asynchronous';
import AsynchronousRaw from '../../../ui/material-ui-components/autocomplete/Asynchronous.tsx?raw';
import GoogleMapsComponent from '../../../ui/material-ui-components/autocomplete/GoogleMaps';
import GoogleMapsRaw from '../../../ui/material-ui-components/autocomplete/GoogleMaps.tsx?raw';
import CustomSingleValueRenderingComponent from '../../../ui/material-ui-components/autocomplete/CustomSingleValueRendering';
import CustomSingleValueRenderingRaw from '../../../ui/material-ui-components/autocomplete/CustomSingleValueRendering.tsx?raw';
import TagsComponent from '../../../ui/material-ui-components/autocomplete/Tags';
import TagsRaw from '../../../ui/material-ui-components/autocomplete/Tags.tsx?raw';
import FixedTagsComponent from '../../../ui/material-ui-components/autocomplete/FixedTags';
import FixedTagsRaw from '../../../ui/material-ui-components/autocomplete/FixedTags.tsx?raw';
import CheckboxesTagsComponent from '../../../ui/material-ui-components/autocomplete/CheckboxesTags';
import CheckboxesTagsRaw from '../../../ui/material-ui-components/autocomplete/CheckboxesTags.tsx?raw';
import LimitTagsComponent from '../../../ui/material-ui-components/autocomplete/LimitTags';
import LimitTagsRaw from '../../../ui/material-ui-components/autocomplete/LimitTags.tsx?raw';
import SizesComponent from '../../../ui/material-ui-components/autocomplete/Sizes';
import SizesRaw from '../../../ui/material-ui-components/autocomplete/Sizes.tsx?raw';
import CustomInputAutocompleteComponent from '../../../ui/material-ui-components/autocomplete/CustomInputAutocomplete';
import CustomInputAutocompleteRaw from '../../../ui/material-ui-components/autocomplete/CustomInputAutocomplete.tsx?raw';
import GloballyCustomizedOptionsComponent from '../../../ui/material-ui-components/autocomplete/GloballyCustomizedOptions';
import GloballyCustomizedOptionsRaw from '../../../ui/material-ui-components/autocomplete/GloballyCustomizedOptions.tsx?raw';
import GitHubLabelComponent from '../../../ui/material-ui-components/autocomplete/GitHubLabel';
import GitHubLabelRaw from '../../../ui/material-ui-components/autocomplete/GitHubLabel.tsx?raw';
import AutocompleteHintComponent from '../../../ui/material-ui-components/autocomplete/AutocompleteHint';
import AutocompleteHintRaw from '../../../ui/material-ui-components/autocomplete/AutocompleteHint.tsx?raw';
import HighlightsComponent from '../../../ui/material-ui-components/autocomplete/Highlights';
import HighlightsRaw from '../../../ui/material-ui-components/autocomplete/Highlights.tsx?raw';
import FilterComponent from '../../../ui/material-ui-components/autocomplete/Filter';
import FilterRaw from '../../../ui/material-ui-components/autocomplete/Filter.tsx?raw';
import VirtualizeComponent from '../../../ui/material-ui-components/autocomplete/Virtualize';
import VirtualizeRaw from '../../../ui/material-ui-components/autocomplete/Virtualize.tsx?raw';

function AutocompleteDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/autocomplete"
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
				Autocomplete
			</Typography>
			<Typography className="description">
				The autocomplete is a normal text input enhanced by a panel of suggested options.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The widget is useful for setting the value of a single-line textbox in one of two types of scenarios:
			</Typography>
			<ol>
				<li>
					The value for the textbox must be chosen from a predefined set of allowed values, for example a
					location field must contain a valid location name: <a href="#combo-box">combo box</a>.
				</li>
				<li>
					The textbox may contain any arbitrary value, but it is advantageous to suggest possible values to
					the user, for example a search field may suggest similar or previous searches to save the user time:{' '}
					<a href="#free-solo">free solo</a>.
				</li>
			</ol>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				It&#39;s meant to be an improved version of the &quot;react-select&quot; and &quot;downshift&quot;
				packages.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Combo box
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The value must be chosen from a predefined set of allowed values.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Options structure
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				By default, the component accepts the following options structures:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-ts"
			>
				{` 
interface AutocompleteOption {
  label: string;
}
// or
type AutocompleteOption = string;
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				for instance:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
const options = [
  { label: 'The Godfather', id: 1 },
  { label: 'Pulp Fiction', id: 2 },
];
// or
const options = ['The Godfather', 'Pulp Fiction'];
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				However, you can use different structures by providing a <code>getOptionLabel</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If your options are objects, you must provide the <code>isOptionEqualToValue</code> prop to ensure
				correct selection and highlighting. By default, it uses strict equality to compare options with the
				current value.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Playground
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Each of the following examples demonstrates one feature of the Autocomplete component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Playground.js"
					className="my-4"
					iframe={false}
					component={PlaygroundComponent}
					raw={PlaygroundRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Country select
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Choose one of the 248 countries.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CountrySelect.js"
					className="my-4"
					iframe={false}
					component={CountrySelectComponent}
					raw={CountrySelectRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Controlled states
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The component has two states that can be controlled:
			</Typography>
			<ol>
				<li>
					the &quot;value&quot; state with the <code>value</code>/<code>onChange</code> props combination.
					This state represents the value selected by the user, for instance when pressing{' '}
					<kbd className="key">Enter</kbd>.
				</li>
				<li>
					the &quot;input value&quot; state with the <code>inputValue</code>/<code>onInputChange</code> props
					combination. This state represents the value displayed in the textbox.
				</li>
			</ol>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				These two states are isolated, and should be controlled independently.
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
					name="ControllableStates.js"
					className="my-4"
					iframe={false}
					component={ControllableStatesComponent}
					raw={ControllableStatesRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you control the <code>value</code>, make sure it&#39;s referentially stable between renders. In other
				words, the reference to the value shouldn&#39;t change if the value itself doesn&#39;t change.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-tsx"
			>
				{` 
// ⚠️ BAD
return <Autocomplete multiple value={allValues.filter((v) => v.selected)} />;

// 👍 GOOD
const selectedValues = React.useMemo(
  () => allValues.filter((v) => v.selected),
  [allValues],
);
return <Autocomplete multiple value={selectedValues} />;
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In the first example, <code>allValues.filter</code> is called and returns <strong>a new array</strong>{' '}
				every render. The fix includes memoizing the value, so it changes only when needed. :::
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Free solo
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Set <code>freeSolo</code> to true so the textbox can contain any arbitrary value.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Search input
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The prop is designed to cover the primary use case of a <strong>search input</strong> with suggestions,
				for example Google search or react-autowhatever.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FreeSolo.js"
					className="my-4"
					iframe={false}
					component={FreeSoloComponent}
					raw={FreeSoloRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning Be careful when using the free solo mode with non-string options, as it may cause type
				mismatch.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The value created by typing into the textbox is always a string, regardless of the type of the options.
				:::
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Creatable
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you intend to use this mode for a <a href="#combo-box">combo box</a> like experience (an enhanced
				version of a select element) we recommend setting:
			</Typography>
			<ul className="space-y-4">
				<li>
					<code>selectOnFocus</code> to help the user clear the selected value.
				</li>
				<li>
					<code>clearOnBlur</code> to help the user enter a new value.
				</li>
				<li>
					<code>handleHomeEndKeys</code> to move focus inside the popup with the{' '}
					<kbd className="key">Home</kbd> and <kbd className="key">End</kbd> keys.
				</li>
				<li>
					A last option, for instance: <code>{`Add "YOUR SEARCH"`}</code>.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FreeSoloCreateOption.js"
					className="my-4"
					iframe={false}
					component={FreeSoloCreateOptionComponent}
					raw={FreeSoloCreateOptionRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You could also display a dialog when the user wants to add a new value.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FreeSoloCreateOptionDialog.js"
					className="my-4"
					iframe={false}
					component={FreeSoloCreateOptionDialogComponent}
					raw={FreeSoloCreateOptionDialogRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Grouped
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can group the options with the <code>groupBy</code> prop. If you do so, make sure that the options
				are also sorted with the same dimension that they are grouped by, otherwise, you will notice duplicate
				headers.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Grouped.js"
					className="my-4"
					iframe={false}
					component={GroupedComponent}
					raw={GroupedRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To control how the groups are rendered, provide a custom <code>renderGroup</code> prop. This is a
				function that accepts an object with two fields:
			</Typography>
			<ul className="space-y-4">
				<li>
					<code>group</code>—a string representing a group name
				</li>
				<li>
					<code>children</code>—a collection of list items that belong to the group
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The following demo shows how to use this prop to define custom markup and override the styles of the
				default groups:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="RenderGroup.js"
					className="my-4"
					iframe={false}
					component={RenderGroupComponent}
					raw={RenderGroupRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Disabled options
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DisabledOptions.js"
					className="my-4"
					iframe={false}
					component={DisabledOptionsComponent}
					raw={DisabledOptionsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				<code>useAutocomplete</code>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For advanced customization use cases, a headless <code>useAutocomplete()</code> hook is exposed. It
				accepts almost the same options as the Autocomplete component minus all the props related to the
				rendering of JSX. The Autocomplete component is built on this hook.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-tsx"
			>
				{` 
import { useAutocomplete } from '@mui/base/useAutocomplete';
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>useAutocomplete</code> hook is also reexported from @mui/material for convenience and backward
				compatibility.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-tsx"
			>
				{` 
import useAutocomplete from '@mui/material/useAutocomplete';
`}
			</FuseHighlight>
			<ul className="space-y-4">
				<li>
					📦 <a href="https://bundlephobia.com/package/@mui/material">4.6 kB gzipped</a>.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="UseAutocomplete.js"
					className="my-4"
					iframe={false}
					component={UseAutocompleteComponent}
					raw={UseAutocompleteRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Customized hook
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedHook.js"
					className="my-4"
					iframe={false}
					component={CustomizedHookComponent}
					raw={CustomizedHookRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Head to the <a href="#customization">customization</a> section for an example with the{' '}
				<code>Autocomplete</code> component instead of the hook.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Asynchronous requests
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The component supports two different asynchronous use-cases:
			</Typography>
			<ul className="space-y-4">
				<li>
					<a href="#load-on-open">Load on open</a>: it waits for the component to be interacted with to load
					the options.
				</li>
				<li>
					<a href="#search-as-you-type">Search as you type</a>: a new request is made for each keystroke.
				</li>
			</ul>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Load on open
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				It displays a progress state as long as the network request is pending.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Asynchronous.js"
					className="my-4"
					iframe={false}
					component={AsynchronousComponent}
					raw={AsynchronousRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Search as you type
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If your logic is fetching new options on each keystroke and using the current value of the textbox to
				filter on the server, you may want to consider throttling requests.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Additionally, you will need to disable the built-in filtering of the <code>Autocomplete</code> component
				by overriding the <code>filterOptions</code> prop:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Autocomplete filterOptions={(x) => x} />
`}
			</FuseHighlight>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Google Maps place
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A customized UI for Google Maps Places Autocomplete. For this demo, we need to load the{' '}
				<a href="https://developers.google.com/maps/documentation/javascript/overview">
					Google Maps JavaScript
				</a>{' '}
				and{' '}
				<a href="https://developers.google.com/maps/documentation/places/web-service/overview">Google Places</a>{' '}
				API.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="GoogleMaps.js"
					className="my-4"
					iframe={false}
					component={GoogleMapsComponent}
					raw={GoogleMapsRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The demo relies on <a href="https://github.com/moroshko/autosuggest-highlight">autosuggest-highlight</a>
				, a small (1 kB) utility for highlighting text in autosuggest and autocomplete components.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::error Before you can start using the Google Maps JavaScript API and Places API, you need to get your
				own <a href="https://developers.google.com/maps/documentation/javascript/get-api-key">API key</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This demo has limited quotas to make API requests. When your quota exceeds, you will see the response
				for &quot;Paris&quot;. :::
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Custom Single Value Rendering
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				By default, when <code>{`multiple={false}`}</code>, the selected option is displayed as plain text
				inside the input. The <code>renderValue</code> prop allows you to customize how the selected value is
				rendered. This can be useful for adding custom styles, displaying additional information, or formatting
				the value differently.
			</Typography>
			<ul className="space-y-4">
				<li>
					The <code>getItemProps</code> callback provides props like <code>data-item-index</code>,{' '}
					<code>disabled</code>, <code>tabIndex</code> and others. These props should be spread onto the
					rendered component for proper accessibility.
				</li>
				<li>
					If using a custom component other than a Material UI Chip, destructure the <code>onDelete</code>{' '}
					prop as it&#39;s specific to the Material UI Chip.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomSingleValueRendering.js"
					className="my-4"
					iframe={false}
					component={CustomSingleValueRenderingComponent}
					raw={CustomSingleValueRenderingRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Multiple values
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				When <code>{`multiple={true}`}</code>, the user can select multiple values. These selected values,
				referred to as &quot;items&quot; can be customized using the <code>renderValue</code> prop.
			</Typography>
			<ul className="space-y-4">
				<li>
					The <code>getItemProps</code> callback supplies essential props like <code>data-item-index</code>,{' '}
					<code>disabled</code>, <code>tabIndex</code> and others. Make sure to spread them on each rendered
					item.
				</li>
				<li>
					If using a custom component other than a Material UI Chip, destructure the <code>onDelete</code>{' '}
					prop as it&#39;s specific to the Material UI Chip.
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Tags.js"
					className="my-4"
					iframe={false}
					component={TagsComponent}
					raw={TagsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Fixed options
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In the event that you need to lock certain tags so that they can&#39;t be removed, you can set the chips
				disabled.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FixedTags.js"
					className="my-4"
					iframe={false}
					component={FixedTagsComponent}
					raw={FixedTagsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Checkboxes
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CheckboxesTags.js"
					className="my-4"
					iframe={false}
					component={CheckboxesTagsComponent}
					raw={CheckboxesTagsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Limit tags
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the <code>limitTags</code> prop to limit the number of displayed options when not focused.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="LimitTags.js"
					className="my-4"
					iframe={false}
					component={LimitTagsComponent}
					raw={LimitTagsRaw}
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
					name="Sizes.js"
					className="my-4"
					iframe={false}
					component={SizesComponent}
					raw={SizesRaw}
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
				Custom input
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>renderInput</code> prop allows you to customize the rendered input. The first argument of this
				render prop contains props that you need to forward. Pay specific attention to the <code>ref</code> and{' '}
				<code>inputProps</code> keys.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning If you&#39;re using a custom input component inside the Autocomplete, make sure that you
				forward the ref to the underlying DOM element. :::
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomInputAutocomplete.js"
					className="my-4"
					iframe={false}
					component={CustomInputAutocompleteComponent}
					raw={CustomInputAutocompleteRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Globally Customized Options
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To globally customize the Autocomplete options for all components in your app, you can use the{' '}
				<a href="/material-ui/customization/theme-components/#theme-default-props">theme default props</a> and
				set the <code>renderOption</code> property in the <code>defaultProps</code> key. The{' '}
				<code>renderOption</code> property takes the <code>ownerState</code> as the fourth parameter, which
				includes props and internal component state. To display the label, you can use the{' '}
				<code>getOptionLabel</code> prop from the <code>ownerState</code>. This approach enables different
				options for each Autocomplete component while keeping the options styling consistent.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="GloballyCustomizedOptions.js"
					className="my-4"
					iframe={false}
					component={GloballyCustomizedOptionsComponent}
					raw={GloballyCustomizedOptionsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				GitHub&#39;s picker
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This demo reproduces GitHub&#39;s label picker:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="GitHubLabel.js"
					className="my-4"
					iframe={false}
					component={GitHubLabelComponent}
					raw={GitHubLabelRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Head to the <a href="#customized-hook">Customized hook</a> section for a customization example with the{' '}
				<code>useAutocomplete</code> hook instead of the component.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Hint
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The following demo shows how to add a hint feature to the Autocomplete:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AutocompleteHint.js"
					className="my-4"
					iframe={false}
					component={AutocompleteHintComponent}
					raw={AutocompleteHintRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Highlights
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The following demo relies on{' '}
				<a href="https://github.com/moroshko/autosuggest-highlight">autosuggest-highlight</a>, a small (1 kB)
				utility for highlighting text in autosuggest and autocomplete components.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Highlights.js"
					className="my-4"
					iframe={false}
					component={HighlightsComponent}
					raw={HighlightsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Custom filter
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The component exposes a factory to create a filter method that can be provided to the{' '}
				<code>filterOptions</code> prop. You can use it to change the default option filter behavior.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
import { createFilterOptions } from '@mui/material/Autocomplete';
`}
			</FuseHighlight>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				<code>{`createFilterOptions(config) => filterOptions`}</code>
			</Typography>
			<Typography
				className="mt-3 mb-2.5 text-base"
				component="h4"
			>
				Arguments
			</Typography>
			<ol>
				<li>
					<code>config</code> (<em>object</em> [optional]):
				</li>
			</ol>
			<ul className="space-y-4">
				<li>
					<code>config.ignoreAccents</code> (<em>bool</em> [optional]): Defaults to <code>true</code>. Remove
					diacritics.
				</li>
				<li>
					<code>config.ignoreCase</code> (<em>bool</em> [optional]): Defaults to <code>true</code>. Lowercase
					everything.
				</li>
				<li>
					<code>config.limit</code> (<em>number</em> [optional]): Default to null. Limit the number of
					suggested options to be shown. For example, if <code>config.limit</code> is <code>100</code>, only
					the first <code>100</code> matching options are shown. It can be useful if a lot of options match
					and virtualization wasn&#39;t set up.
				</li>
				<li>
					<code>config.matchFrom</code> (<em>&#39;any&#39; | &#39;start&#39;</em> [optional]): Defaults to{' '}
					<code>{`'any'`}</code>.
				</li>
				<li>
					<code>config.stringify</code> (<em>func</em> [optional]): Controls how an option is converted into a
					string so that it can be matched against the input text fragment.
				</li>
				<li>
					<code>config.trim</code> (<em>bool</em> [optional]): Defaults to <code>false</code>. Remove trailing
					spaces.
				</li>
			</ul>
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
				<code>filterOptions</code>: the returned filter method can be provided directly to the{' '}
				<code>filterOptions</code> prop of the <code>Autocomplete</code> component, or the parameter of the same
				name for the hook.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In the following demo, the options need to start with the query prefix:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
const filterOptions = createFilterOptions({
  matchFrom: 'start',
  stringify: (option) => option.title,
});

<Autocomplete filterOptions={filterOptions} />;
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Filter.js"
					className="my-4"
					iframe={false}
					component={FilterComponent}
					raw={FilterRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Advanced
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For richer filtering mechanisms, like fuzzy matching, it&#39;s recommended to look at{' '}
				<a href="https://github.com/kentcdodds/match-sorter">match-sorter</a>. For instance:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
import { matchSorter } from 'match-sorter';

const filterOptions = (options, { inputValue }) => matchSorter(options, inputValue);

<Autocomplete filterOptions={filterOptions} />;
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Virtualization
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Search within 10,000 randomly generated options. The list is virtualized thanks to{' '}
				<a href="https://github.com/bvaughn/react-window">react-window</a>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Virtualize.js"
					className="my-4"
					iframe={false}
					component={VirtualizeComponent}
					raw={VirtualizeRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Events
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you would like to prevent the default key handler behavior, you can set the event&#39;s{' '}
				<code>defaultMuiPrevented</code> property to <code>true</code>:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Autocomplete
  onKeyDown={(event) => {
    if (event.key === 'Enter') {
      // Prevent's default 'Enter' behavior.
      event.defaultMuiPrevented = true;
      // your handler code
    }
  
/>
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
				autocomplete/autofill
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Browsers have heuristics to help the user fill in form inputs. However, this can harm the UX of the
				component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				By default, the component disables the input <strong>autocomplete</strong> feature (remembering what the
				user has typed for a given field in a previous session) with the <code>{`autoComplete="off"`}</code>{' '}
				attribute. Google Chrome does not currently support this attribute setting (
				<a href="https://issues.chromium.org/issues/41239842">Issue 41239842</a>). A possible workaround is to
				remove the <code>id</code> to have the component generate a random one.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In addition to remembering past entered values, the browser might also propose <strong>autofill</strong>{' '}
				suggestions (saved login, address, or payment details). In the event you want the avoid autofill, you
				can try the following:
			</Typography>
			<ul className="space-y-4">
				<li>
					<Typography
						className="mb-8 text-base"
						component="div"
					>
						Name the input without leaking any information the browser can use. For example{' '}
						<code>{`id="field1"`}</code> instead of <code>{`id="country"`}</code>. If you leave the id
						empty, the component uses a random id.
					</Typography>
				</li>
				<li>
					<Typography
						className="mb-8 text-base"
						component="div"
					>
						Set <code>{`autoComplete="new-password"`}</code> (some browsers will suggest a strong password
						for inputs with this attribute setting):
					</Typography>

					<FuseHighlight
						component="pre"
						className="language-jsx"
					>
						{` 
<TextField
  {...params}
  inputProps={{
    ...params.inputProps,
    autoComplete: 'new-password',
  
/>
`}
					</FuseHighlight>
				</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Read{' '}
				<a href="https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/Turning_off_form_autocompletion">
					the guide on MDN
				</a>{' '}
				for more details.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				iOS VoiceOver
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				VoiceOver on iOS Safari doesn&#39;t support the <code>aria-owns</code> attribute very well. You can work
				around the issue with the <code>disablePortal</code> prop.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				ListboxComponent
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you provide a custom <code>ListboxComponent</code> prop, you need to make sure that the intended
				scroll container has the <code>role</code> attribute set to <code>listbox</code>. This ensures the
				correct behavior of the scroll, for example when using the keyboard to navigate.
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
				<a href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/">
					https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
				</a>
				)
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				We encourage the usage of a label for the textbox. The component implements the WAI-ARIA authoring
				practices.
			</Typography>
		</>
	);
}

export default AutocompleteDoc;
