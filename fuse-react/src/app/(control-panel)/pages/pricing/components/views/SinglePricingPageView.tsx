'use client';
import { motion } from 'motion/react';
import SinglePricingCard from '../ui/single/SinglePricingCard';
import PricingContent from '../ui/PricingContent';

import PricingHeader from '../ui/PricingHeader';

/**
 * The single pricing page.
 */
function SinglePricingPageView() {
	return (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
			<PricingHeader />

			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
				className="flex justify-center p-4 md:p-8"
			>
				<SinglePricingCard />
			</motion.div>
			<PricingContent />
		</div>
	);
}

export default SinglePricingPageView;
