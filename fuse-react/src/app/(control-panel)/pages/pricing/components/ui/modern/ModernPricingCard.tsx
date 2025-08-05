import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import clsx from 'clsx';
import Chip from '@mui/material/Chip';
import ModernPricingItemType from './ModernPricingItemType';

type ModernPricingCardProps = ModernPricingItemType & {
	className?: string;
};

/**
 * The modern pricing card component.
 */
function ModernPricingCard(props: ModernPricingCardProps) {
	const {
		period = '',
		title = '',
		subtitle = '',
		yearlyPrice = '',
		monthlyPrice = '',
		buttonTitle = '',
		isPopular = false,
		details = '',
		className = ''
	} = props;

	return (
		<Paper
			className={clsx(
				'relative max-w-full flex-col p-6 sm:px-10 sm:py-12 md:max-w-none',
				isPopular && '',
				className
			)}
			sx={[
				isPopular &&
					((theme) => ({
						border: `1px solid ${theme.vars.palette.secondary.main}!important`
					}))
			]}
		>
			{isPopular && (
				<div className="absolute inset-x-0 -top-4 flex items-center justify-center">
					<Chip
						label="POPULAR"
						color="secondary"
						className="flex h-8 items-center rounded-full px-8 text-center leading-none font-medium"
					/>
				</div>
			)}
			<Typography className="text-4xl leading-[1.25] font-bold tracking-tight">{title}</Typography>
			<Typography
				className="mt-2 text-lg font-medium tracking-tight"
				color="text.secondary"
			>
				{subtitle}
			</Typography>
			<Divider className="bg-accent my-10 h-1 w-8 rounded-sm" />
			<div className="flex items-baseline whitespace-nowrap">
				<Typography className="mr-2 text-2xl">USD</Typography>
				<Typography className="text-6xl leading-[1.25] font-semibold tracking-tight">
					{period === 'month' && monthlyPrice}
					{period === 'year' && yearlyPrice}
				</Typography>
			</div>
			<Typography
				className="mt-2 flex flex-col"
				color="text.secondary"
			>
				{period === 'month' && (
					<>
						<span>billed monthly</span>
						<span>
							<b>{yearlyPrice}</b> billed yearly
						</span>
					</>
				)}
				{period === 'year' && (
					<>
						<span>billed yearly</span>
						<span>
							<b>{monthlyPrice}</b> billed monthly
						</span>
					</>
				)}
			</Typography>
			<Button
				className="mt-10 w-full"
				size="large"
				variant={isPopular ? 'contained' : 'outlined'}
				color={isPopular ? 'secondary' : 'inherit'}
			>
				{buttonTitle}
			</Button>
			{details}
		</Paper>
	);
}

export default ModernPricingCard;
