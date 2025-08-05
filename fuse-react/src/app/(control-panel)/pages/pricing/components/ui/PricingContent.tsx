import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import PricingFeatureItem from './PricingFeatureItem';
import clsx from 'clsx';

type PricingContentProps = {
	className?: string;
};

function PricingContent(props: PricingContentProps) {
	const { className } = props;

	return (
		<div className={clsx('flex flex-col', className)}>
			<Paper
				className="flex flex-col items-center rounded-b-none px-6 py-10 sm:px-16 sm:pt-18 sm:pb-20 md:mx-0"
				elevation={0}
			>
				<div className="container">
					<div>
						<Typography className="text-3xl leading-[1.25] font-extrabold tracking-tight">
							Everything you need to build efficiently
						</Typography>
						<Typography
							className="mt-0.5 max-w-3xl text-xl"
							color="text.secondary"
						>
							Start building your app using our tools, be efficient, spend less time with details more
							time with your business
						</Typography>
					</div>
					<div className="mt-12 grid w-full grid-cols-1 gap-x-6 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
						<PricingFeatureItem
							icon="lucide:square-pen"
							title="Create and Edit Projects"
							subtitle="Create and edit projects, upload images via drag drop, add categories, add custom
                fields, create interactive forms and more."
						/>
						<PricingFeatureItem
							icon="lucide:funnel"
							title="Search and Filter"
							subtitle="Search and filter within the projects, categories and custom fields. Save search and
                filter details for easy access."
						/>
						<PricingFeatureItem
							icon="lucide:refresh-cw"
							title="Real Time Updates"
							subtitle="Real time updates that doesn't require page reload. Lean back and watch the changes
                happen in real time."
						/>
						<PricingFeatureItem
							icon="lucide:tag"
							title="Meta Information"
							subtitle="Add and remove meta information to custom fields to differentiate them in reports and analytics results, use them for detailed reports."
						/>
						<PricingFeatureItem
							icon="lucide:file-text"
							title="Pre-rendered Results"
							subtitle="Pre-render results to make reports and analytics more accessible by screen readers
                and other accessibility tools."
						/>
						<PricingFeatureItem
							icon="lucide:chart-area"
							title="Simple Analytics"
							subtitle="Simple analytics with no unnecessary data flow or weight. More readable results with
                less data consumption."
						/>
					</div>
				</div>
			</Paper>
			<Box
				sx={{ backgroundColor: 'primary.dark', color: 'primary.contrastText' }}
				className="px-6 py-10 sm:px-16 sm:py-12"
			>
				<div className="container mx-auto flex flex-col items-center text-center">
					<Typography className="text-3xl leading-6 font-extrabold sm:text-5xl sm:leading-10">
						Boost your productivity.
					</Typography>
					<Button
						className="mt-8 px-12 text-lg"
						size="large"
						color="secondary"
						variant="contained"
					>
						Start using Fuse today.
					</Button>
				</div>
			</Box>

			<div className="flex flex-col items-center px-6 pt-8 pb-8 sm:px-16 sm:pt-18 sm:pb-20">
				<div className="container">
					<div>
						<Typography className="text-4xl leading-[1.25] font-extrabold tracking-tight">
							Frequently asked questions
						</Typography>
						<Typography
							className="max-w-3xl text-xl"
							color="text.secondary"
						>
							Here are the most frequently asked questions you may check before getting started
						</Typography>
					</div>
					<div className="mt-12 grid w-full grid-cols-1 gap-x-6 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:gap-x-16">
						<div>
							<Typography className="text-xl font-semibold">
								What is the duration of the free trial?
							</Typography>
							<Typography
								className="mt-2"
								color="text.secondary"
							>
								Our app is free to try for 14 days, if you want more, you can provide payment details
								which will extend your trial to 30 days providing you an extra 16 more days to try our
								app.
							</Typography>
						</div>
						<div>
							<Typography className="text-xl font-semibold">
								Are there discounts for non-profits or educational use?
							</Typography>
							<Typography
								className="mt-2"
								color="text.secondary"
							>
								Yes, our Personal and Premium packages are free for non-profits and educational use.
								E-mail your details to us after starting your Free Trial and we will upgrade your
								account if you qualify.
							</Typography>
						</div>
						<div>
							<Typography className="text-xl font-semibold">What is the storage is for?</Typography>
							<Typography
								className="mt-2"
								color="text.secondary"
							>
								Since we provide an extremely detailed reporting and analytics tool, they require quite
								a bit storage space. For average use, you don’t have to worry about running out of space
								since the Personal package limits the projects you can have.
							</Typography>
							<Typography
								className="mt-2"
								color="text.secondary"
							>
								For some reason if you run out of space, contact us and we will see what can be done
								about it and make sure you are not generating unnecessary reports and/or analytics data.
							</Typography>
						</div>
						<div>
							<Typography className="text-xl font-semibold">
								What happens if I’m not satisfied?
							</Typography>
							<Typography
								className="mt-2"
								color="text.secondary"
							>
								If you are still in your free trial period, you can cancel your account at anytime with
								a single click of a button. If you already paid for your first month, we also offer
								30-day money-back guarantee with no questions asked.
							</Typography>
							<Typography
								className="mt-2"
								color="text.secondary"
							>
								After first month, you can still cancel your account at any time but we will calculate
								the amount that corresponds to days you have been using our app for that month and
								refund only the remaining amount.
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PricingContent;
