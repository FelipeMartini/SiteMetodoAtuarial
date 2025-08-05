'use client';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Box from '@mui/material/Box';
import { ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Link from '@fuse/core/Link';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useMainThemeDark } from '@fuse/core/FuseSettings/hooks/fuseThemeHooks';
import FaqList from '../ui/faq/FaqList';
import { useFaqCategories } from '../../api/hooks/faqs/useFaqCategories';
import { useFaqsByCategory } from '../../api/hooks/faqs/useFaqsByCategory';

/**
 * The help center home.
 */
function HelpCenterHomeView() {
	const mainThemeDark = useMainThemeDark();
	const { data: faqsCategories } = useFaqCategories();
	const mostFaqCategoryId = faqsCategories?.[0]?.id;
	const { data: faqsMost, isLoading: isFaqsMostLoading } = useFaqsByCategory(mostFaqCategoryId);

	return (
		<div className="flex min-w-0 flex-auto flex-col">
			<ThemeProvider theme={mainThemeDark}>
				<Box
					className="relative overflow-hidden px-4 pt-8 pb-20 sm:px-16 sm:pt-20 sm:pb-32"
					sx={(theme) => ({
						backgroundColor: 'primary.dark',
						color: theme.palette.getContrastText(theme.palette.primary.main)
					})}
				>
					<div className="mx-auto flex w-full flex-col items-center justify-center gap-2">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0 } }}
						>
							<PageBreadcrumb
								className="mb-2"
								color="inherit"
								borderColor="inherit"
							/>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0 } }}
						>
							<Typography className="text-center text-5xl leading-[1.25] font-extrabold tracking-tight sm:text-7xl">
								How can we help you today?
							</Typography>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.3 } }}
						>
							<Typography
								color="text.secondary"
								className="text-center tracking-tight sm:text-2xl"
							>
								Check out our FAQs and guides, or contact us for detailed support
							</Typography>
						</motion.div>
					</div>
					<svg
						className="pointer-events-none absolute inset-0"
						viewBox="0 0 960 540"
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMax slice"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g
							className="opacity-5"
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
						</g>
					</svg>
				</Box>
			</ThemeProvider>
			<div className="flex flex-col items-center px-4 md:px-6">
				<div className="-mt-12 grid w-full max-w-sm grid-cols-1 gap-y-4 md:max-w-6xl md:grid-cols-3 md:gap-x-6 md:gap-y-0">
					<Card
						component={Link}
						to="/apps/help-center/faqs"
						role="button"
						className="relative flex flex-col overflow-hidden p-4 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-lg"
					>
						<div className="flex flex-auto flex-col items-center justify-center text-center">
							<div className="text-2xl font-semibold">FAQs</div>
							<div
								className="mt-1 md:max-w-40"
								color="text.secondary"
							>
								Frequently asked questions and answers
							</div>
						</div>
						<Box className="mt-3 flex items-center justify-center gap-2">
							<Typography color="secondary">Go to FAQs</Typography>
							<FuseSvgIcon color="secondary">lucide:arrow-right</FuseSvgIcon>
						</Box>
					</Card>
					<Card
						component={Link}
						to="/apps/help-center/guides"
						role="button"
						className="relative flex flex-col overflow-hidden p-4 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-lg"
					>
						<div className="flex flex-auto flex-col items-center justify-center text-center">
							<div className="text-2xl font-semibold">Guides</div>
							<div
								className="mt-1 md:max-w-40"
								color="text.secondary"
							>
								Articles and resources to guide you
							</div>
						</div>
						<Box className="mt-3 flex items-center justify-center gap-2">
							<Typography color="secondary">Check guides</Typography>
							<FuseSvgIcon color="secondary">lucide:arrow-right</FuseSvgIcon>
						</Box>
					</Card>
					<Card
						component={Link}
						to="/apps/help-center/support"
						role="button"
						className="relative flex flex-col overflow-hidden p-4 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-lg"
					>
						<div className="flex flex-auto flex-col items-center justify-center text-center">
							<div className="text-2xl font-semibold">Support</div>
							<div
								className="mt-1 md:max-w-40"
								color="text.secondary"
							>
								Contact us for more detailed support
							</div>
						</div>
						<Box className="mt-3 flex items-center justify-center gap-2">
							<Typography color="secondary">Contact us</Typography>
							<FuseSvgIcon color="secondary">lucide:arrow-right</FuseSvgIcon>
						</Box>
					</Card>
				</div>
			</div>
			<Typography className="mt-12 px-4 text-center text-3xl leading-[1.25] font-extrabold tracking-tight sm:text-5xl">
				Most frequently asked questions
			</Typography>
			<Typography
				className="mt-2 px-4 text-center text-xl"
				color="text.secondary"
			>
				Here are the most frequently asked questions you may check before getting started
			</Typography>
			<div className="mt-6 flex w-full flex-col items-center px-4">
				<FaqList
					className="w-full max-w-6xl"
					list={faqsMost}
					isLoading={isFaqsMostLoading}
				/>
			</div>
		</div>
	);
}

export default HelpCenterHomeView;
