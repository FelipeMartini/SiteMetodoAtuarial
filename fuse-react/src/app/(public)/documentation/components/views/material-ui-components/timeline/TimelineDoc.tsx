// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicTimelineComponent from '../../../ui/material-ui-components/timeline/BasicTimeline';
import BasicTimelineRaw from '../../../ui/material-ui-components/timeline/BasicTimeline.tsx?raw';
import LeftPositionedTimelineComponent from '../../../ui/material-ui-components/timeline/LeftPositionedTimeline';
import LeftPositionedTimelineRaw from '../../../ui/material-ui-components/timeline/LeftPositionedTimeline.tsx?raw';
import AlternateTimelineComponent from '../../../ui/material-ui-components/timeline/AlternateTimeline';
import AlternateTimelineRaw from '../../../ui/material-ui-components/timeline/AlternateTimeline.tsx?raw';
import AlternateReverseTimelineComponent from '../../../ui/material-ui-components/timeline/AlternateReverseTimeline';
import AlternateReverseTimelineRaw from '../../../ui/material-ui-components/timeline/AlternateReverseTimeline.tsx?raw';
import ColorsTimelineComponent from '../../../ui/material-ui-components/timeline/ColorsTimeline';
import ColorsTimelineRaw from '../../../ui/material-ui-components/timeline/ColorsTimeline.tsx?raw';
import OutlinedTimelineComponent from '../../../ui/material-ui-components/timeline/OutlinedTimeline';
import OutlinedTimelineRaw from '../../../ui/material-ui-components/timeline/OutlinedTimeline.tsx?raw';
import OppositeContentTimelineComponent from '../../../ui/material-ui-components/timeline/OppositeContentTimeline';
import OppositeContentTimelineRaw from '../../../ui/material-ui-components/timeline/OppositeContentTimeline.tsx?raw';
import CustomizedTimelineComponent from '../../../ui/material-ui-components/timeline/CustomizedTimeline';
import CustomizedTimelineRaw from '../../../ui/material-ui-components/timeline/CustomizedTimeline.tsx?raw';
import LeftAlignedTimelineComponent from '../../../ui/material-ui-components/timeline/LeftAlignedTimeline';
import LeftAlignedTimelineRaw from '../../../ui/material-ui-components/timeline/LeftAlignedTimeline.tsx?raw';
import RightAlignedTimelineComponent from '../../../ui/material-ui-components/timeline/RightAlignedTimeline';
import RightAlignedTimelineRaw from '../../../ui/material-ui-components/timeline/RightAlignedTimeline.tsx?raw';
import NoOppositeContentComponent from '../../../ui/material-ui-components/timeline/NoOppositeContent';
import NoOppositeContentRaw from '../../../ui/material-ui-components/timeline/NoOppositeContent.tsx?raw';

function TimelineDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/timeline"
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
				Timeline
			</Typography>
			<Typography className="description">
				The timeline displays a list of events in chronological order.
			</Typography>

			<div className="my-3 rounded-xl border-1 p-4">
				<Typography
					className="mb-8 text-base"
					component="div"
				>
					This component is not documented in the{' '}
					<a href="https://m2.material.io/">Material Design guidelines</a>, but it is available in
					Material UI.
				</Typography>
			</div>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic timeline
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A basic timeline showing list of events.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicTimeline.js"
					className="my-4"
					iframe={false}
					component={BasicTimelineComponent}
					raw={BasicTimelineRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Left-positioned timeline
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The main content of the timeline can be positioned on the left side relative to the time axis.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="LeftPositionedTimeline.js"
					className="my-4"
					iframe={false}
					component={LeftPositionedTimelineComponent}
					raw={LeftPositionedTimelineRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Alternating timeline
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The timeline can display the events on alternating sides.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AlternateTimeline.js"
					className="my-4"
					iframe={false}
					component={AlternateTimelineComponent}
					raw={AlternateTimelineRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Reverse Alternating timeline
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The timeline can display the events on alternating sides in reverse order.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AlternateReverseTimeline.js"
					className="my-4"
					iframe={false}
					component={AlternateReverseTimelineComponent}
					raw={AlternateReverseTimelineRaw}
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
				The <code>TimelineDot</code> can appear in different colors from theme palette.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColorsTimeline.js"
					className="my-4"
					iframe={false}
					component={ColorsTimelineComponent}
					raw={ColorsTimelineRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Outlined
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="OutlinedTimeline.js"
					className="my-4"
					iframe={false}
					component={OutlinedTimelineComponent}
					raw={OutlinedTimelineRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Opposite content
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The timeline can display content on opposite sides.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="OppositeContentTimeline.js"
					className="my-4"
					iframe={false}
					component={OppositeContentTimelineComponent}
					raw={OppositeContentTimelineRaw}
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
					name="CustomizedTimeline.js"
					className="my-4"
					iframe={false}
					component={CustomizedTimelineComponent}
					raw={CustomizedTimelineRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Alignment
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				There are different ways in which a Timeline can be placed within the container.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can do it by overriding the styles.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A Timeline centers itself in the container by default.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The demos below show how to adjust the relative width of the left and right sides of a Timeline:
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Left-aligned
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="LeftAlignedTimeline.js"
					className="my-4"
					iframe={false}
					component={LeftAlignedTimelineComponent}
					raw={LeftAlignedTimelineRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Right-aligned
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="RightAlignedTimeline.js"
					className="my-4"
					iframe={false}
					component={RightAlignedTimelineComponent}
					raw={RightAlignedTimelineRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Left-aligned with no opposite content
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="NoOppositeContent.js"
					className="my-4"
					iframe={false}
					component={NoOppositeContentComponent}
					raw={NoOppositeContentRaw}
				/>
			</Typography>
		</>
	);
}

export default TimelineDoc;
