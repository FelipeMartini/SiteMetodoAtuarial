'use client';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { motion } from 'motion/react';
import FuseLoading from '@fuse/core/FuseLoading';
import FinanceDashboardAppHeader from '../ui/FinanceDashboardAppHeader';
import PreviousStatementWidget from '../ui/widgets/PreviousStatementWidget';
import CurrentStatementWidget from '../ui/widgets/CurrentStatementWidget';
import AccountBalanceWidget from '../ui/widgets/AccountBalanceWidget';
import RecentTransactionsWidget from '../ui/widgets/RecentTransactionsWidget';
import BudgetWidget from '../ui/widgets/BudgetWidget';
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
 * The finance dashboard app.
 */
function FinanceDashboardAppView() {
	const { data: widgets, isLoading } = useGetWidgets();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widgets) {
		return null;
	}

	return (
		<FusePageSimple
			header={<FinanceDashboardAppHeader />}
			content={
				<div className="w-full px-4 pt-4 pb-6 md:px-8">
					<motion.div
						className="w-full"
						variants={container}
						initial="hidden"
						animate="show"
					>
						<div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
							<div className="grid gap-4 sm:grid-flow-col xl:grid-flow-row">
								<motion.div
									variants={item}
									className="flex flex-auto flex-col"
								>
									<PreviousStatementWidget />
								</motion.div>

								<motion.div
									variants={item}
									className="flex flex-auto flex-col"
								>
									<CurrentStatementWidget />
								</motion.div>
							</div>
							<motion.div
								variants={item}
								className="flex flex-auto flex-col"
							>
								<AccountBalanceWidget />
							</motion.div>
						</div>
						<div className="mt-4 grid w-full grid-cols-1 gap-4 xl:grid-cols-3">
							<motion.div
								variants={item}
								className="flex flex-auto flex-col xl:col-span-2"
							>
								<RecentTransactionsWidget />
							</motion.div>
							<motion.div
								variants={item}
								className="flex flex-auto flex-col"
							>
								<BudgetWidget />
							</motion.div>
						</div>
					</motion.div>
				</div>
			}
		/>
	);
}

export default FinanceDashboardAppView;
