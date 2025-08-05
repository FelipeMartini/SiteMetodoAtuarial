// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BasicButtonGroupComponent from '../../../ui/material-ui-components/button-group/BasicButtonGroup';
import BasicButtonGroupRaw from '../../../ui/material-ui-components/button-group/BasicButtonGroup.tsx?raw';
import VariantButtonGroupComponent from '../../../ui/material-ui-components/button-group/VariantButtonGroup';
import VariantButtonGroupRaw from '../../../ui/material-ui-components/button-group/VariantButtonGroup.tsx?raw';
import GroupSizesColorsComponent from '../../../ui/material-ui-components/button-group/GroupSizesColors';
import GroupSizesColorsRaw from '../../../ui/material-ui-components/button-group/GroupSizesColors.tsx?raw';
import GroupOrientationComponent from '../../../ui/material-ui-components/button-group/GroupOrientation';
import GroupOrientationRaw from '../../../ui/material-ui-components/button-group/GroupOrientation.tsx?raw';
import SplitButtonComponent from '../../../ui/material-ui-components/button-group/SplitButton';
import SplitButtonRaw from '../../../ui/material-ui-components/button-group/SplitButton.tsx?raw';
import DisableElevationComponent from '../../../ui/material-ui-components/button-group/DisableElevation';
import DisableElevationRaw from '../../../ui/material-ui-components/button-group/DisableElevation.tsx?raw';
import LoadingButtonGroupComponent from '../../../ui/material-ui-components/button-group/LoadingButtonGroup';
import LoadingButtonGroupRaw from '../../../ui/material-ui-components/button-group/LoadingButtonGroup.tsx?raw';

function ButtonGroupDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/button-group"
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
				Button Group
			</Typography>
			<Typography className="description">
				The ButtonGroup component can be used to group related buttons.
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basic button group
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The buttons can be grouped by wrapping them with the <code>ButtonGroup</code> component. They need to be
				immediate children.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="BasicButtonGroup.js"
					className="my-4"
					iframe={false}
					component={BasicButtonGroupComponent}
					raw={BasicButtonGroupRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Button variants
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				All the standard button variants are supported.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="VariantButtonGroup.js"
					className="my-4"
					iframe={false}
					component={VariantButtonGroupComponent}
					raw={VariantButtonGroupRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Sizes and colors
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>size</code> and <code>color</code> props can be used to control the appearance of the button
				group.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="GroupSizesColors.js"
					className="my-4"
					iframe={false}
					component={GroupSizesColorsComponent}
					raw={GroupSizesColorsRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Vertical group
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The button group can be displayed vertically using the <code>orientation</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="GroupOrientation.js"
					className="my-4"
					iframe={false}
					component={GroupOrientationComponent}
					raw={GroupOrientationRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Split button
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<code>ButtonGroup</code> can also be used to create a split button. The dropdown can change the button
				action (as in this example) or be used to immediately trigger a related action.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="SplitButton.js"
					className="my-4"
					iframe={false}
					component={SplitButtonComponent}
					raw={SplitButtonRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Disabled elevation
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				You can remove the elevation with the <code>disableElevation</code> prop.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="DisableElevation.js"
					className="my-4"
					iframe={false}
					component={DisableElevationComponent}
					raw={DisableElevationRaw}
				/>
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Loading
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Use the <code>loading</code> prop from <code>Button</code> to set buttons in a loading state and disable
				interactions.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="LoadingButtonGroup.js"
					className="my-4"
					iframe={false}
					component={LoadingButtonGroupComponent}
					raw={LoadingButtonGroupRaw}
				/>
			</Typography>
		</>
	);
}

export default ButtonGroupDoc;
