// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimpleContainerComponent from '../../../ui/material-ui-components/container/SimpleContainer';
import SimpleContainerRaw from '../../../ui/material-ui-components/container/SimpleContainer.tsx?raw';
import FixedContainerComponent from '../../../ui/material-ui-components/container/FixedContainer';
import FixedContainerRaw from '../../../ui/material-ui-components/container/FixedContainer.tsx?raw';

function ContainerDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/container"
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
				Container
			</Typography>
			<Typography className="description">
				The container centers your content horizontally. It's the most basic layout element.
			</Typography>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				While containers can be nested, most layouts do not require a nested container.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Fluid
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				A fluid container width is bounded by the <code>maxWidth</code> prop value.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SimpleContainer.js"
					className="my-4"
					iframe
					component={SimpleContainerComponent}
					raw={SimpleContainerRaw}
				/>
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Container maxWidth="sm">
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Fixed
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				If you prefer to design for a fixed set of sizes instead of trying to accommodate a fully fluid
				viewport, you can set the <code>fixed</code> prop. The max-width matches the min-width of the current
				breakpoint.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="FixedContainer.js"
					className="my-4"
					iframe
					component={FixedContainerComponent}
					raw={FixedContainerRaw}
				/>
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Container fixed>
`}
			</FuseHighlight>
		</>
	);
}

export default ContainerDoc;
