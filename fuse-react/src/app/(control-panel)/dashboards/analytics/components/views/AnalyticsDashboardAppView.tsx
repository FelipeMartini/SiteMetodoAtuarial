'use client';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import FuseLoading from '@fuse/core/FuseLoading';
import AnalyticsDashboardAppHeader from '../ui/AnalyticsDashboardAppHeader';
import VisitorsOverviewWidget from '../ui/widgets/VisitorsOverviewWidget';
import ConversionsWidget from '../ui/widgets/ConversionsWidget';
import ImpressionsWidget from '../ui/widgets/ImpressionsWidget';
import VisitsWidget from '../ui/widgets/VisitsWidget';
import VisitorsVsPageViewsWidget from '../ui/widgets/VisitorsVsPageViewsWidget';
import NewVsReturningWidget from '../ui/widgets/NewVsReturningWidget';
import AgeWidget from '../ui/widgets/AgeWidget';
import LanguageWidget from '../ui/widgets/LanguageWidget';
import GenderWidget from '../ui/widgets/GenderWidget';
import { useGetWidgets } from '../../api/hooks/widgets/useGetWidgets';

const container = {
	show: {
		transition: {
			staggerChildren: 0.04
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 }
};

/**
 * The analytics dashboard app.
 */
function AnalyticsDashboardAppView() {
	const { isLoading } = useGetWidgets();

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<FusePageSimple
			header={<AnalyticsDashboardAppHeader />}
			content={
				<motion.div
					className="grid w-full grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3"
					variants={container}
					initial="hidden"
					animate="show"
				>
					<motion.div
						variants={item}
						className="sm:col-span-2 lg:col-span-3"
					>
						<VisitorsOverviewWidget />
					</motion.div>

					<motion.div
						variants={item}
						className="sm:col-span-2 lg:col-span-1"
					>
						<ConversionsWidget />
					</motion.div>

					<motion.div
						variants={item}
						className="sm:col-span-2 lg:col-span-1"
					>
						<ImpressionsWidget />
					</motion.div>

					<motion.div
						variants={item}
						className="sm:col-span-2 lg:col-span-1"
					>
						<VisitsWidget />
					</motion.div>

					<motion.div
						variants={item}
						className="sm:col-span-2 lg:col-span-3"
					>
						<VisitorsVsPageViewsWidget />
					</motion.div>

					<div className="mt-4 w-full sm:col-span-3">
						<Typography className="text-2xl leading-6 font-semibold tracking-tight">
							Your Audience
						</Typography>
						<Typography
							className="font-medium tracking-tight"
							color="text.secondary"
						>
							Demographic properties of your users
						</Typography>
					</div>

					<div className="grid w-full grid-cols-1 gap-4 sm:col-span-3 sm:grid-cols-2 lg:grid-cols-4">
						<motion.div variants={item}>
							<NewVsReturningWidget />
						</motion.div>
						<motion.div variants={item}>
							<GenderWidget />
						</motion.div>
						<motion.div variants={item}>
							<AgeWidget />
						</motion.div>
						<motion.div variants={item}>
							<LanguageWidget />
						</motion.div>
					</div>
				</motion.div>
			}
		/>
	);
}

export default AnalyticsDashboardAppView;
