import Paper from '@mui/material/Paper';
import FuseCountdown from '@fuse/core/FuseCountdown';
import ComingSoonPageTitle from '../ui/ComingSoonPageTitle';
import ComingSoonPageForm from '../forms/ComingSoonPageForm';
import ComingSoonMessageSection from '../ui/ComingSoonMessageSection';

/**
 * The modern reversed coming soon page.
 */
function SplitScreenComingSoonPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-16 md:shadow-none ltr:border-r-1 rtl:border-l-1">
				<div className="mx-auto flex w-full max-w-80 flex-col items-center justify-center gap-12">
					<ComingSoonPageTitle />

					<FuseCountdown endDate="2071-07-28" />

					<ComingSoonPageForm />
				</div>
			</Paper>

			<ComingSoonMessageSection />
		</div>
	);
}

export default SplitScreenComingSoonPageView;
