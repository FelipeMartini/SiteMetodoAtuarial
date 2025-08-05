import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

type PricingFeatureItemProps = {
	title?: string;
	subtitle?: string;
	icon?: string;
};

/**
 * The pricing feature item component.
 */
function PricingFeatureItem(props: PricingFeatureItemProps) {
	const { title = '', subtitle = '', icon = '' } = props;

	return (
		<div>
			<Box
				className="flex h-8 w-8 items-center justify-center rounded-sm"
				sx={{ backgroundColor: 'secondary.main', color: 'secondary.contrastText' }}
			>
				<FuseSvgIcon>{icon}</FuseSvgIcon>
			</Box>
			<Typography className="mt-4 text-xl font-medium">{title}</Typography>
			<Typography
				className="mt-2 leading-tight"
				color="text.secondary"
			>
				{subtitle}
			</Typography>
		</div>
	);
}

export default PricingFeatureItem;
