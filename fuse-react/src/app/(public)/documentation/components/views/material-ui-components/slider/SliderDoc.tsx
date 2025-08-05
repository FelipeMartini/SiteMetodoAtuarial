// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ContinuousSliderComponent from '../../../ui/material-ui-components/slider/ContinuousSlider';
import ContinuousSliderRaw from '../../../ui/material-ui-components/slider/ContinuousSlider.tsx?raw';
import SliderSizesComponent from '../../../ui/material-ui-components/slider/SliderSizes';
import SliderSizesRaw from '../../../ui/material-ui-components/slider/SliderSizes.tsx?raw';
import DiscreteSliderComponent from '../../../ui/material-ui-components/slider/DiscreteSlider';
import DiscreteSliderRaw from '../../../ui/material-ui-components/slider/DiscreteSlider.tsx?raw';
import DiscreteSliderStepsComponent from '../../../ui/material-ui-components/slider/DiscreteSliderSteps';
import DiscreteSliderStepsRaw from '../../../ui/material-ui-components/slider/DiscreteSliderSteps.tsx?raw';
import DiscreteSliderMarksComponent from '../../../ui/material-ui-components/slider/DiscreteSliderMarks';
import DiscreteSliderMarksRaw from '../../../ui/material-ui-components/slider/DiscreteSliderMarks.tsx?raw';
import DiscreteSliderValuesComponent from '../../../ui/material-ui-components/slider/DiscreteSliderValues';
import DiscreteSliderValuesRaw from '../../../ui/material-ui-components/slider/DiscreteSliderValues.tsx?raw';
import DiscreteSliderLabelComponent from '../../../ui/material-ui-components/slider/DiscreteSliderLabel';
import DiscreteSliderLabelRaw from '../../../ui/material-ui-components/slider/DiscreteSliderLabel.tsx?raw';
import RangeSliderComponent from '../../../ui/material-ui-components/slider/RangeSlider';
import RangeSliderRaw from '../../../ui/material-ui-components/slider/RangeSlider.tsx?raw';
import MinimumDistanceSliderComponent from '../../../ui/material-ui-components/slider/MinimumDistanceSlider';
import MinimumDistanceSliderRaw from '../../../ui/material-ui-components/slider/MinimumDistanceSlider.tsx?raw';
import InputSliderComponent from '../../../ui/material-ui-components/slider/InputSlider';
import InputSliderRaw from '../../../ui/material-ui-components/slider/InputSlider.tsx?raw';
import ColorSliderComponent from '../../../ui/material-ui-components/slider/ColorSlider';
import ColorSliderRaw from '../../../ui/material-ui-components/slider/ColorSlider.tsx?raw';
import CustomizedSliderComponent from '../../../ui/material-ui-components/slider/CustomizedSlider';
import CustomizedSliderRaw from '../../../ui/material-ui-components/slider/CustomizedSlider.tsx?raw';
import MusicPlayerSliderComponent from '../../../ui/material-ui-components/slider/MusicPlayerSlider';
import MusicPlayerSliderRaw from '../../../ui/material-ui-components/slider/MusicPlayerSlider.tsx?raw';
import VerticalSliderComponent from '../../../ui/material-ui-components/slider/VerticalSlider';
import VerticalSliderRaw from '../../../ui/material-ui-components/slider/VerticalSlider.tsx?raw';
import CustomMarksComponent from '../../../ui/material-ui-components/slider/CustomMarks';
import CustomMarksRaw from '../../../ui/material-ui-components/slider/CustomMarks.tsx?raw';
import TrackFalseSliderComponent from '../../../ui/material-ui-components/slider/TrackFalseSlider';
import TrackFalseSliderRaw from '../../../ui/material-ui-components/slider/TrackFalseSlider.tsx?raw';
import TrackInvertedSliderComponent from '../../../ui/material-ui-components/slider/TrackInvertedSlider';
import TrackInvertedSliderRaw from '../../../ui/material-ui-components/slider/TrackInvertedSlider.tsx?raw';
import NonLinearSliderComponent from '../../../ui/material-ui-components/slider/NonLinearSlider';
import NonLinearSliderRaw from '../../../ui/material-ui-components/slider/NonLinearSlider.tsx?raw';

function SliderDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/slider"
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
				Slider
			</Typography>
			<Typography className="description">
				Sliders allow users to make selections from a range of values.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Sliders reflect a range of values along a bar, from which users may select a single value. They are
				ideal for adjusting settings such as volume, brightness, or applying image filters.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Continuous sliders
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Continuous sliders allow users to select a value along a subjective range.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ContinuousSlider.js"
					className="my-4"
					iframe={false}
					component={ContinuousSliderComponent}
					raw={ContinuousSliderRaw}
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
				For smaller slider, use the prop <code>{`size="small"`}</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SliderSizes.js"
					className="my-4"
					iframe={false}
					component={SliderSizesComponent}
					raw={SliderSizesRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Discrete sliders
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Discrete sliders can be adjusted to a specific value by referencing its value indicator. You can
				generate a mark for each step with <code>{`marks={true}`}</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DiscreteSlider.js"
					className="my-4"
					iframe={false}
					component={DiscreteSliderComponent}
					raw={DiscreteSliderRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Small steps
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can change the default step increment. Make sure to adjust the <code>shiftStep</code> prop (the
				granularity with which the slider can step when using Page Up/Down or Shift + Arrow Up/Down) to a value
				divisible by the <code>step</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DiscreteSliderSteps.js"
					className="my-4"
					iframe={false}
					component={DiscreteSliderStepsComponent}
					raw={DiscreteSliderStepsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Custom marks
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can have custom marks by providing a rich array to the <code>marks</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DiscreteSliderMarks.js"
					className="my-4"
					iframe={false}
					component={DiscreteSliderMarksComponent}
					raw={DiscreteSliderMarksRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Restricted values
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can restrict the selectable values to those provided with the <code>marks</code> prop with{' '}
				<code>{`step={null}`}</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DiscreteSliderValues.js"
					className="my-4"
					iframe={false}
					component={DiscreteSliderValuesComponent}
					raw={DiscreteSliderValuesRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Label always visible
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can force the thumb label to be always visible with <code>{`valueLabelDisplay="on"`}</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DiscreteSliderLabel.js"
					className="my-4"
					iframe={false}
					component={DiscreteSliderLabelComponent}
					raw={DiscreteSliderLabelRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Range slider
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The slider can be used to set the start and end of a range by supplying an array of values to the{' '}
				<code>value</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="RangeSlider.js"
					className="my-4"
					iframe={false}
					component={RangeSliderComponent}
					raw={RangeSliderRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Minimum distance
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can enforce a minimum distance between values in the <code>onChange</code> event handler. By
				default, when you move the pointer over a thumb while dragging another thumb, the active thumb will swap
				to the hovered thumb. You can disable this behavior with the <code>disableSwap</code> prop. If you want
				the range to shift when reaching minimum distance, you can utilize the <code>activeThumb</code>{' '}
				parameter in <code>onChange</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="MinimumDistanceSlider.js"
					className="my-4"
					iframe={false}
					component={MinimumDistanceSliderComponent}
					raw={MinimumDistanceSliderRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Slider with input field
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In this example, an input allows a discrete value to be set.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="InputSlider.js"
					className="my-4"
					iframe={false}
					component={InputSliderComponent}
					raw={InputSliderRaw}
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
					name="ColorSlider.js"
					className="my-4"
					iframe={false}
					component={ColorSliderComponent}
					raw={ColorSliderRaw}
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
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomizedSlider.js"
					className="my-4"
					iframe={false}
					component={CustomizedSliderComponent}
					raw={CustomizedSliderRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Music player
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="MusicPlayerSlider.js"
					className="my-4"
					iframe={false}
					component={MusicPlayerSliderComponent}
					raw={MusicPlayerSliderRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Vertical sliders
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Set the <code>orientation</code> prop to <code>{`"vertical"`}</code> to create vertical sliders. The
				thumb will track vertical movement instead of horizontal movement.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="VerticalSlider.js"
					className="my-4"
					iframe={false}
					component={VerticalSliderComponent}
					raw={VerticalSliderRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::warning Chrome versions below 124 implement <code>aria-orientation</code> incorrectly for vertical
				sliders and expose them as <code>{`'horizontal'`}</code> in the accessibility tree. (
				<a href="https://issues.chromium.org/issues/40736841">Chromium issue #40736841</a>)
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>-webkit-appearance: slider-vertical</code> CSS property can be used to correct this for these
				older versions, with the trade-off of causing a console warning in newer Chrome versions:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-css"
			>
				{` 
.MuiSlider-thumb input {
  -webkit-appearance: slider-vertical;
}
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				:::
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Marks placement
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can customize your slider by adding and repositioning marks for minimum and maximum values.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomMarks.js"
					className="my-4"
					iframe={false}
					component={CustomMarksComponent}
					raw={CustomMarksRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Track
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The track shows the range available for user selection.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Removed track
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The track can be turned off with <code>{`track={false}`}</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TrackFalseSlider.js"
					className="my-4"
					iframe={false}
					component={TrackFalseSliderComponent}
					raw={TrackFalseSliderRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Inverted track
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The track can be inverted with <code>{`track="inverted"`}</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TrackInvertedSlider.js"
					className="my-4"
					iframe={false}
					component={TrackInvertedSliderComponent}
					raw={TrackInvertedSliderRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Non-linear scale
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the <code>scale</code> prop to represent the <code>value</code> on a different scale.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In the following demo, the value <em>x</em> represents the value <em>2^x</em>. Increasing <em>x</em> by
				one increases the represented value by factor <em>2</em>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="NonLinearSlider.js"
					className="my-4"
					iframe={false}
					component={NonLinearSliderComponent}
					raw={NonLinearSliderRaw}
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
				<a href="https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/">
					https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
				</a>
				)
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The component handles most of the work necessary to make it accessible. However, you need to make sure
				that:
			</Typography>
			<ul className="space-y-4">
				<li>
					Each thumb has a user-friendly label (<code>aria-label</code>, <code>aria-labelledby</code> or{' '}
					<code>getAriaLabel</code> prop).
				</li>
				<li>
					Each thumb has a user-friendly text for its current value. This is not required if the value matches
					the semantics of the label. You can change the name with the <code>getAriaValueText</code> or{' '}
					<code>aria-valuetext</code> prop.
				</li>
			</ul>
		</>
	);
}

export default SliderDoc;
