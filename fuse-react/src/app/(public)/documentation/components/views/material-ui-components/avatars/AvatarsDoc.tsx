// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ImageAvatarsComponent from '../../../ui/material-ui-components/avatars/ImageAvatars';
import ImageAvatarsRaw from '../../../ui/material-ui-components/avatars/ImageAvatars.tsx?raw';
import LetterAvatarsComponent from '../../../ui/material-ui-components/avatars/LetterAvatars';
import LetterAvatarsRaw from '../../../ui/material-ui-components/avatars/LetterAvatars.tsx?raw';
import BackgroundLetterAvatarsComponent from '../../../ui/material-ui-components/avatars/BackgroundLetterAvatars';
import BackgroundLetterAvatarsRaw from '../../../ui/material-ui-components/avatars/BackgroundLetterAvatars.tsx?raw';
import SizeAvatarsComponent from '../../../ui/material-ui-components/avatars/SizeAvatars';
import SizeAvatarsRaw from '../../../ui/material-ui-components/avatars/SizeAvatars.tsx?raw';
import IconAvatarsComponent from '../../../ui/material-ui-components/avatars/IconAvatars';
import IconAvatarsRaw from '../../../ui/material-ui-components/avatars/IconAvatars.tsx?raw';
import VariantAvatarsComponent from '../../../ui/material-ui-components/avatars/VariantAvatars';
import VariantAvatarsRaw from '../../../ui/material-ui-components/avatars/VariantAvatars.tsx?raw';
import FallbackAvatarsComponent from '../../../ui/material-ui-components/avatars/FallbackAvatars';
import FallbackAvatarsRaw from '../../../ui/material-ui-components/avatars/FallbackAvatars.tsx?raw';
import GroupAvatarsComponent from '../../../ui/material-ui-components/avatars/GroupAvatars';
import GroupAvatarsRaw from '../../../ui/material-ui-components/avatars/GroupAvatars.tsx?raw';
import TotalAvatarsComponent from '../../../ui/material-ui-components/avatars/TotalAvatars';
import TotalAvatarsRaw from '../../../ui/material-ui-components/avatars/TotalAvatars.tsx?raw';
import CustomSurplusAvatarsComponent from '../../../ui/material-ui-components/avatars/CustomSurplusAvatars';
import CustomSurplusAvatarsRaw from '../../../ui/material-ui-components/avatars/CustomSurplusAvatars.tsx?raw';
import SpacingComponent from '../../../ui/material-ui-components/avatars/Spacing';
import SpacingRaw from '../../../ui/material-ui-components/avatars/Spacing.tsx?raw';
import BadgeAvatarsComponent from '../../../ui/material-ui-components/avatars/BadgeAvatars';
import BadgeAvatarsRaw from '../../../ui/material-ui-components/avatars/BadgeAvatars.tsx?raw';
import UploadAvatarsComponent from '../../../ui/material-ui-components/avatars/UploadAvatars';
import UploadAvatarsRaw from '../../../ui/material-ui-components/avatars/UploadAvatars.tsx?raw';

function AvatarsDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/avatars"
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
				Avatar
			</Typography>
			<Typography className="description">
				Avatars are found throughout material design with uses in everything from tables to dialog menus.
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Image avatars
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Image avatars can be created by passing standard <code>img</code> props <code>src</code> or{' '}
				<code>srcSet</code> to the component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ImageAvatars.js"
					className="my-4"
					iframe={false}
					component={ImageAvatarsComponent}
					raw={ImageAvatarsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Letter avatars
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Avatars containing simple characters can be created by passing a string as <code>children</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="LetterAvatars.js"
					className="my-4"
					iframe={false}
					component={LetterAvatarsComponent}
					raw={LetterAvatarsRaw}
				/>
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use different background colors for the avatar. The following demo generates the color based on
				the name of the person.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BackgroundLetterAvatars.js"
					className="my-4"
					iframe={false}
					component={BackgroundLetterAvatarsComponent}
					raw={BackgroundLetterAvatarsRaw}
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
				You can change the size of the avatar with the <code>height</code> and <code>width</code> CSS
				properties.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SizeAvatars.js"
					className="my-4"
					iframe={false}
					component={SizeAvatarsComponent}
					raw={SizeAvatarsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Icon avatars
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Icon avatars are created by passing an icon as <code>children</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="IconAvatars.js"
					className="my-4"
					iframe={false}
					component={IconAvatarsComponent}
					raw={IconAvatarsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Variants
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you need square or rounded avatars, use the <code>variant</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="VariantAvatars.js"
					className="my-4"
					iframe={false}
					component={VariantAvatarsComponent}
					raw={VariantAvatarsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Fallbacks
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If there is an error loading the avatar image, the component falls back to an alternative in the
				following order:
			</Typography>
			<ul className="space-y-4">
				<li>the provided children</li>
				<li>
					the first letter of the <code>alt</code> text
				</li>
				<li>a generic avatar icon</li>
			</ul>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FallbackAvatars.js"
					className="my-4"
					iframe={false}
					component={FallbackAvatarsComponent}
					raw={FallbackAvatarsRaw}
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
				<code>AvatarGroup</code> renders its children as a stack. Use the <code>max</code> prop to limit the
				number of avatars.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="GroupAvatars.js"
					className="my-4"
					iframe={false}
					component={GroupAvatarsComponent}
					raw={GroupAvatarsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Total avatars
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you need to control the total number of avatars not shown, you can use the <code>total</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TotalAvatars.js"
					className="my-4"
					iframe={false}
					component={TotalAvatarsComponent}
					raw={TotalAvatarsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Custom surplus
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Set the <code>renderSurplus</code> prop as a callback to customize the surplus avatar. The callback will
				receive the surplus number as an argument based on the children and the <code>max</code> prop, and
				should return a <code>React.ReactNode</code>.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>renderSurplus</code> prop is useful when you need to render the surplus based on the data sent
				from the server.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomSurplusAvatars.js"
					className="my-4"
					iframe={false}
					component={CustomSurplusAvatarsComponent}
					raw={CustomSurplusAvatarsRaw}
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
				You can change the spacing between avatars using the <code>spacing</code> prop. You can use one of the
				presets (<code>{`"medium"`}</code>, the default, or <code>{`"small"`}</code>) or set a custom numeric
				value.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Spacing.js"
					className="my-4"
					iframe={false}
					component={SpacingComponent}
					raw={SpacingRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				With badge
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BadgeAvatars.js"
					className="my-4"
					iframe={false}
					component={BadgeAvatarsComponent}
					raw={BadgeAvatarsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Avatar upload
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="UploadAvatars.js"
					className="my-4"
					iframe={false}
					component={UploadAvatarsComponent}
					raw={UploadAvatarsRaw}
				/>
			</Typography>
		</>
	);
}

export default AvatarsDoc;
