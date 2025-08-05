// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimpleBadgeComponent from '../../../ui/material-ui-components/badges/SimpleBadge';
import SimpleBadgeRaw from '../../../ui/material-ui-components/badges/SimpleBadge.tsx?raw';
import ColorBadgeComponent from '../../../ui/material-ui-components/badges/ColorBadge';
import ColorBadgeRaw from '../../../ui/material-ui-components/badges/ColorBadge.tsx?raw';
import CustomizedBadgesComponent from '../../../ui/material-ui-components/badges/CustomizedBadges';
import CustomizedBadgesRaw from '../../../ui/material-ui-components/badges/CustomizedBadges.tsx?raw';
import BadgeVisibilityComponent from '../../../ui/material-ui-components/badges/BadgeVisibility';
import BadgeVisibilityRaw from '../../../ui/material-ui-components/badges/BadgeVisibility.tsx?raw';
import ShowZeroBadgeComponent from '../../../ui/material-ui-components/badges/ShowZeroBadge';
import ShowZeroBadgeRaw from '../../../ui/material-ui-components/badges/ShowZeroBadge.tsx?raw';
import BadgeMaxComponent from '../../../ui/material-ui-components/badges/BadgeMax';
import BadgeMaxRaw from '../../../ui/material-ui-components/badges/BadgeMax.tsx?raw';
import DotBadgeComponent from '../../../ui/material-ui-components/badges/DotBadge';
import DotBadgeRaw from '../../../ui/material-ui-components/badges/DotBadge.tsx?raw';
import BadgeOverlapComponent from '../../../ui/material-ui-components/badges/BadgeOverlap';
import BadgeOverlapRaw from '../../../ui/material-ui-components/badges/BadgeOverlap.tsx?raw';
import AccessibleBadgesComponent from '../../../ui/material-ui-components/badges/AccessibleBadges';
import AccessibleBadgesRaw from '../../../ui/material-ui-components/badges/AccessibleBadges.tsx?raw';

function BadgesDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/badges"
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
				Badge
			</Typography>
			<Typography className="description">
				Badge generates a small badge to the top-right of its child(ren).
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic badge
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Examples of badges containing text, using primary and secondary colors. The badge is applied to its
				children.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleBadge.js"
					className="my-4"
					iframe={false}
					component={SimpleBadgeComponent}
					raw={SimpleBadgeRaw}
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
				Use <code>color</code> prop to apply theme palette to component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColorBadge.js"
					className="my-4"
					iframe={false}
					component={ColorBadgeComponent}
					raw={ColorBadgeRaw}
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
					name="CustomizedBadges.js"
					className="my-4"
					iframe={false}
					component={CustomizedBadgesComponent}
					raw={CustomizedBadgesRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Badge visibility
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The visibility of badges can be controlled using the <code>invisible</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BadgeVisibility.js"
					className="my-4"
					iframe={false}
					component={BadgeVisibilityComponent}
					raw={BadgeVisibilityRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The badge hides automatically when <code>badgeContent</code> is zero. You can override this with the{' '}
				<code>showZero</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ShowZeroBadge.js"
					className="my-4"
					iframe={false}
					component={ShowZeroBadgeComponent}
					raw={ShowZeroBadgeRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Maximum value
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the <code>max</code> prop to cap the value of the badge content.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BadgeMax.js"
					className="my-4"
					iframe={false}
					component={BadgeMaxComponent}
					raw={BadgeMaxRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Dot badge
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>dot</code> prop changes a badge into a small dot. This can be used as a notification that
				something has changed without giving a count.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DotBadge.js"
					className="my-4"
					iframe={false}
					component={DotBadgeComponent}
					raw={DotBadgeRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Badge overlap
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the <code>overlap</code> prop to place the badge relative to the corner of the wrapped
				element.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BadgeOverlap.js"
					className="my-4"
					iframe={false}
					component={BadgeOverlapComponent}
					raw={BadgeOverlapRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Badge alignment
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the <code>anchorOrigin</code> prop to move the badge to any corner of the wrapped element.
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
				You can&#39;t rely on the content of the badge to be announced correctly. You should provide a full
				description, for instance, with <code>aria-label</code>:
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AccessibleBadges.js"
					className="my-4"
					iframe={false}
					component={AccessibleBadgesComponent}
					raw={AccessibleBadgesRaw}
				/>
			</Typography>
		</>
	);
}

export default BadgesDoc;
