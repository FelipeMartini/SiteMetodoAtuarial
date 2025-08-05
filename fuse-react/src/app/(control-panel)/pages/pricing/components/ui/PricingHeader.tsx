import { motion } from 'motion/react';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

type PricingHeaderProps = {
	tabsValue?: string;
	tabsOnChange?: (event: React.SyntheticEvent, value: string) => void;
};

function PricingHeader(props: PricingHeaderProps) {
	const { tabsValue, tabsOnChange } = props;

	return (
		<div className="relative overflow-hidden p-4 sm:p-8">
			<svg
				className="pointer-events-none absolute inset-0 -z-1"
				viewBox="0 0 960 540"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMax slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Box
					component="g"
					sx={{ color: 'divider' }}
					className="opacity-20"
					fill="none"
					stroke="currentColor"
					strokeWidth="100"
				>
					<circle
						r="234"
						cx="196"
						cy="23"
					/>
					<circle
						r="234"
						cx="790"
						cy="491"
					/>
				</Box>
			</svg>
			<div className="flex flex-col items-center">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { delay: 0.05 } }}
				>
					<PageBreadcrumb className="mb-4" />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
				>
					<div className="text-center text-4xl leading-[1.25] font-extrabold tracking-tight sm:text-7xl">
						Take control of your productivity
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1, transition: { delay: 0.15 } }}
				>
					<Typography
						className="mt-1 w-full text-center tracking-tight sm:text-2xl md:mt-3"
						color="text.secondary"
					>
						Start small and free, upgrade as you go. Take control of everything.
					</Typography>
				</motion.div>

				{tabsValue && tabsOnChange && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0.2 } }}
					>
						<Tabs
							className="mt-4 md:mt-8"
							value={tabsValue}
							onChange={tabsOnChange}
						>
							<Tab
								label="Monthly"
								value="month"
							/>
							<Tab
								label="Yearly"
								value="year"
							/>
						</Tabs>
					</motion.div>
				)}
			</div>
		</div>
	);
}

export default PricingHeader;
