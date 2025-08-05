'use client';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion } from 'motion/react';
import ModernPricingCard from '../ui/modern/ModernPricingCard';
import PricingContent from '../ui/PricingContent';
import PricingHeader from '../ui/PricingHeader';
import ModernPricingItemType from '../ui/modern/ModernPricingItemType';

/**
 * The modern pricing page.
 */
function ModernPricingPageView() {
	const [period, setPeriod] = useState<ModernPricingItemType['period']>('month');

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
				tabsOnChange={(_, value) => setPeriod(value as ModernPricingItemType['period'])}
			/>

			<div className="flex justify-center p-4 md:p-8">
				<div className="container">
					<motion.div
						variants={container}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 gap-y-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-3 lg:gap-y-0"
					>
						<motion.div variants={item}>
							<ModernPricingCard
								period={period}
								title="Personal"
								subtitle="Perfect for an individual or a small team starting to get bigger"
								yearlyPrice="$9.00"
								monthlyPrice="$6.00"
								buttonTitle="Get Started"
								details={
									<div className="mt-12 flex flex-col">
										<Typography className="font-semibold">Core features, including:</Typography>
										<div className="mt-4 flex flex-col gap-2">
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">
													<b>10</b> projects
												</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">
													<b>5GB</b> storage
												</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">Analytics</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">Free mobile app</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">Access to forums</Typography>
											</div>
										</div>
									</div>
								}
							/>
						</motion.div>
						<motion.div variants={item}>
							<ModernPricingCard
								period={period}
								title="Premium"
								subtitle="Perfect for growing teams wanting to be in more control"
								yearlyPrice="$12.00"
								monthlyPrice="$15.00"
								buttonTitle="Start a free 14-day trial"
								details={
									<div className="mt-12 flex flex-col">
										<Typography className="font-semibold">Personal features, plus:</Typography>
										<div className="mt-4 flex flex-col gap-2">
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">
													<b>Unlimited</b> projects
												</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">
													<b>Unlimited</b> storage
												</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">Custom domains</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">Bulk editing</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">12 / 5 support</Typography>
											</div>
										</div>
									</div>
								}
								isPopular
							/>
						</motion.div>
						<motion.div variants={item}>
							<ModernPricingCard
								period={period}
								title="Enterprise"
								subtitle="Perfect for companies wanting advanced tools and support"
								yearlyPrice="$49.00"
								monthlyPrice="$69.00"
								buttonTitle="Start a free 7-day trial"
								details={
									<div className="mt-12 flex flex-col">
										<Typography className="font-semibold">Premium features, plus:</Typography>
										<div className="mt-4 flex flex-col gap-2">
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">
													<b>Dedicated</b> hardware
												</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">
													<b>%99.9</b> uptime
												</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">Advanced analytics</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">
													3rd party integrations
												</Typography>
											</div>
											<div className="flex">
												<FuseSvgIcon
													className="text-green-600"
													size={20}
												>
													lucide:check
												</FuseSvgIcon>
												<Typography className="ml-0.5 leading-5">24 / 7 support</Typography>
											</div>
										</div>
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

export default ModernPricingPageView;
