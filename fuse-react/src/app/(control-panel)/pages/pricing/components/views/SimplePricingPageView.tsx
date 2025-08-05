'use client';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import SimplePricingCard from '../ui/simple/SimplePricingCard';
import SimplePricingItemType from '../ui/simple/SimplePricingItemType';
import PricingContent from '../ui/PricingContent';
import PricingHeader from '../ui/PricingHeader';

/**
 * The simple pricing page.
 */
function SimplePricingPageView() {
	const [period, setPeriod] = useState<SimplePricingItemType['period']>('month');

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 100 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
			<PricingHeader
				tabsValue={period}
				tabsOnChange={(_, value) => setPeriod(value as SimplePricingItemType['period'])}
			/>

			<div className="mb-6 flex justify-center p-4 md:p-8">
				<div className="container">
					<motion.div
						variants={container}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 items-center gap-y-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-0"
					>
						<motion.div variants={item}>
							<SimplePricingCard
								className="lg:rounded-r-none"
								period={period}
								title="Personal"
								subtitle="Perfect for an individual or a small team starting to get bigger"
								yearlyPrice="$9"
								monthlyPrice="$6"
								buttonTitle="Start your trial"
								details={
									<div className="mt-8 flex flex-col gap-2">
										<Typography className="ml-0.5 leading-5">
											<b>10</b> projects
										</Typography>
										<Typography className="ml-0.5 leading-5">
											<b>5GB</b> storage
										</Typography>
										<Typography className="ml-0.5 leading-5">Analytics</Typography>
										<Typography className="ml-0.5 leading-5">Free mobile app</Typography>
										<Typography className="ml-0.5 leading-5">Access to forums</Typography>
									</div>
								}
							/>
						</motion.div>
						<motion.div
							variants={item}
							className="lg:z-99 lg:overflow-visible"
						>
							<SimplePricingCard
								className="lg:pb-28 lg:shadow-2xl"
								period={period}
								title="Premium"
								subtitle="Perfect for growing teams wanting to be in more control"
								yearlyPrice="$12"
								monthlyPrice="$15"
								buttonTitle="Start your trial"
								details={
									<div className="mt-8 flex flex-col gap-2">
										<Typography className="ml-0.5 leading-5">
											<b>Unlimited</b> projects
										</Typography>
										<Typography className="ml-0.5 leading-5">
											<b>Unlimited</b> storage
										</Typography>
										<Typography className="ml-0.5 leading-5">Custom domains</Typography>
										<Typography className="ml-0.5 leading-5">Bulk editing</Typography>
										<Typography className="ml-0.5 leading-5">12 / 5 support</Typography>
									</div>
								}
								isPopular
							/>
						</motion.div>
						<motion.div variants={item}>
							<SimplePricingCard
								className="lg:rounded-l-none"
								period={period}
								title="Enterprise"
								subtitle="Perfect for companies wanting advanced tools and support"
								yearlyPrice="$49"
								monthlyPrice="$69"
								buttonTitle="Start your trial"
								details={
									<div className="mt-8 flex flex-col gap-2">
										<Typography className="ml-0.5 leading-5">
											<b>Dedicated</b> hardware
										</Typography>
										<Typography className="ml-0.5 leading-5">
											<b>%99.9</b> uptime
										</Typography>
										<Typography className="ml-0.5 leading-5">Advanced analytics</Typography>
										<Typography className="ml-0.5 leading-5">3rd party integrations</Typography>
										<Typography className="ml-0.5 leading-5">24 / 7 support</Typography>
									</div>
								}
							/>
						</motion.div>
					</motion.div>
				</div>
			</div>

			<PricingContent />
		</div>
	);
}

export default SimplePricingPageView;
