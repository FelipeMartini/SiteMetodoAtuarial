// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicChipsComponent from '../../../ui/material-ui-components/chips/BasicChips';
import BasicChipsRaw from '../../../ui/material-ui-components/chips/BasicChips.tsx?raw';
import ClickableChipsComponent from '../../../ui/material-ui-components/chips/ClickableChips';
import ClickableChipsRaw from '../../../ui/material-ui-components/chips/ClickableChips.tsx?raw';
import DeletableChipsComponent from '../../../ui/material-ui-components/chips/DeletableChips';
import DeletableChipsRaw from '../../../ui/material-ui-components/chips/DeletableChips.tsx?raw';
import ClickableAndDeletableChipsComponent from '../../../ui/material-ui-components/chips/ClickableAndDeletableChips';
import ClickableAndDeletableChipsRaw from '../../../ui/material-ui-components/chips/ClickableAndDeletableChips.tsx?raw';
import ClickableLinkChipsComponent from '../../../ui/material-ui-components/chips/ClickableLinkChips';
import ClickableLinkChipsRaw from '../../../ui/material-ui-components/chips/ClickableLinkChips.tsx?raw';
import CustomDeleteIconChipsComponent from '../../../ui/material-ui-components/chips/CustomDeleteIconChips';
import CustomDeleteIconChipsRaw from '../../../ui/material-ui-components/chips/CustomDeleteIconChips.tsx?raw';
import AvatarChipsComponent from '../../../ui/material-ui-components/chips/AvatarChips';
import AvatarChipsRaw from '../../../ui/material-ui-components/chips/AvatarChips.tsx?raw';
import IconChipsComponent from '../../../ui/material-ui-components/chips/IconChips';
import IconChipsRaw from '../../../ui/material-ui-components/chips/IconChips.tsx?raw';
import ColorChipsComponent from '../../../ui/material-ui-components/chips/ColorChips';
import ColorChipsRaw from '../../../ui/material-ui-components/chips/ColorChips.tsx?raw';
import SizesChipsComponent from '../../../ui/material-ui-components/chips/SizesChips';
import SizesChipsRaw from '../../../ui/material-ui-components/chips/SizesChips.tsx?raw';
import MultilineChipsComponent from '../../../ui/material-ui-components/chips/MultilineChips';
import MultilineChipsRaw from '../../../ui/material-ui-components/chips/MultilineChips.tsx?raw';
import ChipsArrayComponent from '../../../ui/material-ui-components/chips/ChipsArray';
import ChipsArrayRaw from '../../../ui/material-ui-components/chips/ChipsArray.tsx?raw';

function ChipsDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/chips"
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
				Chip
			</Typography>
			<Typography className="description">
				Chips are compact elements that represent an input, attribute, or action.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Chips allow users to enter information, make selections, filter content, or trigger actions.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				While included here as a standalone component, the most common use will be in some form of input, so
				some of the behavior demonstrated here is not shown in context.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic chip
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>Chip</code> component supports outlined and filled styling.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicChips.js"
					className="my-4"
					iframe={false}
					component={BasicChipsComponent}
					raw={BasicChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Chip actions
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the following actions.
			</Typography>
			<ul className="space-y-4">
				<li>
					Chips with the <code>onClick</code> prop defined change appearance on focus, hover, and click.
				</li>
				<li>
					Chips with the <code>onDelete</code> prop defined will display a delete icon which changes
					appearance on hover.
				</li>
			</ul>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Clickable
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ClickableChips.js"
					className="my-4"
					iframe={false}
					component={ClickableChipsComponent}
					raw={ClickableChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Deletable
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DeletableChips.js"
					className="my-4"
					iframe={false}
					component={DeletableChipsComponent}
					raw={DeletableChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Clickable and deletable
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ClickableAndDeletableChips.js"
					className="my-4"
					iframe={false}
					component={ClickableAndDeletableChipsComponent}
					raw={ClickableAndDeletableChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Clickable link
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ClickableLinkChips.js"
					className="my-4"
					iframe={false}
					component={ClickableLinkChipsComponent}
					raw={ClickableLinkChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Custom delete icon
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="CustomDeleteIconChips.js"
					className="my-4"
					iframe={false}
					component={CustomDeleteIconChipsComponent}
					raw={CustomDeleteIconChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Chip adornments
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can add ornaments to the beginning of the component.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Use the <code>avatar</code> prop to add an avatar or use the <code>icon</code> prop to add an icon.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Avatar chip
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="AvatarChips.js"
					className="my-4"
					iframe={false}
					component={AvatarChipsComponent}
					raw={AvatarChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Icon chip
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="IconChips.js"
					className="my-4"
					iframe={false}
					component={IconChipsComponent}
					raw={IconChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Color chip
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the <code>color</code> prop to define a color from theme palette.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ColorChips.js"
					className="my-4"
					iframe={false}
					component={ColorChipsComponent}
					raw={ColorChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Sizes chip
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can use the <code>size</code> prop to define a small Chip.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SizesChips.js"
					className="my-4"
					iframe={false}
					component={SizesChipsComponent}
					raw={SizesChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Multiline chip
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				By default, Chips displays labels only in a single line. To have them support multiline content, use the{' '}
				<code>sx</code> prop to add <code>height:auto</code> to the Chip component, and{' '}
				<code>whiteSpace: normal</code> to the <code>label</code> styles.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="MultilineChips.js"
					className="my-4"
					iframe={false}
					component={MultilineChipsComponent}
					raw={MultilineChipsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Chip array
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				An example of rendering multiple chips from an array of values. Deleting a chip removes it from the
				array. Note that since no
				<code>onClick</code> prop is defined, the <code>Chip</code> can be focused, but does not gain depth
				while clicked or touched.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="ChipsArray.js"
					className="my-4"
					iframe={false}
					component={ChipsArrayComponent}
					raw={ChipsArrayRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Chip playground
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
				If the Chip is deletable or clickable then it is a button in tab order. When the Chip is focused (for
				example when tabbing) releasing (<code>keyup</code> event) <code>Backspace</code> or <code>Delete</code>{' '}
				will call the <code>onDelete</code> handler while releasing <code>Escape</code> will blur the Chip.
			</Typography>
		</>
	);
}

export default ChipsDoc;
