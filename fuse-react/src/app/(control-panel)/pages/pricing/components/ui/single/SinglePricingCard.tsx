import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The single pricing card component.
 */
function SinglePricingCard() {
	return (
		<Paper className="flex max-w-full flex-col overflow-hidden lg:max-w-5xl lg:flex-row">
			<div className="p-6 sm:p-8 lg:p-10">
				<Typography className="text-3xl font-bold">Lifetime Membership</Typography>

				<Typography
					className="mt-2 leading-[1.625]"
					color="text.secondary"
				>
					Learn from like-minded individuals which are eager to make a living building stuff on the web. Pay
					once and get lifetime access to the community.
				</Typography>

				<div className="mt-10 flex items-center">
					<Typography
						className="font-medium"
						color="text.secondary"
					>
						INCLUDED FEATURES
					</Typography>
					<Divider className="ml-2 flex-auto" />
				</div>

				<div className="mt-6 grid grid-cols-1 gap-y-4 lg:grid-cols-2">
					<div className="flex items-center">
						<FuseSvgIcon
							size={20}
							color="secondary"
						>
							lucide:circle-check
						</FuseSvgIcon>
						<div className="ml-2">Private forum access</div>
					</div>
					<div className="flex items-center">
						<FuseSvgIcon
							size={20}
							color="secondary"
						>
							lucide:circle-check
						</FuseSvgIcon>
						<div className="ml-2">Access to annual online conference</div>
					</div>
					<div className="flex items-center">
						<FuseSvgIcon
							size={20}
							color="secondary"
						>
							lucide:circle-check
						</FuseSvgIcon>
						<div className="ml-2">Member resources</div>
					</div>
					<div className="flex items-center">
						<FuseSvgIcon
							size={20}
							color="secondary"
						>
							lucide:circle-check
						</FuseSvgIcon>
						<div className="ml-2">Official member T-Shirt</div>
					</div>
				</div>
			</div>

			<Box
				sx={{ backgroundColor: 'primary.dark', color: 'primary.contrastText' }}
				className="flex flex-col items-center justify-center p-2 lg:min-w-80 lg:px-10 lg:py-12"
			>
				<div className="flex items-center whitespace-nowrap">
					<Typography
						className="text-7xl font-extrabold tracking-tight"
						color="primary.contrastText"
					>
						$599
					</Typography>
					<Typography
						className="ml-0.5 text-2xl font-semibold"
						color="primary.contrastText"
					>
						USD
					</Typography>
				</div>
				<Typography
					className="mt-2 text-center font-medium"
					color="primary.contrastText"
				>
					No monthly subscription,
					<br />
					you only pay once.
				</Typography>
				<Button
					variant="contained"
					color="secondary"
					className="mt-8 w-full"
				>
					Get Started
				</Button>
			</Box>
		</Paper>
	);
}

export default SinglePricingCard;
