import Paper from '@mui/material/Paper';
import FuseCountdown from '@fuse/core/FuseCountdown';
import ComingSoonPageForm from '../forms/ComingSoonPageForm';
import ComingSoonPageTitle from '../ui/ComingSoonPageTitle';
import ComingSoonMessageSection from '../ui/ComingSoonMessageSection';

/**
 * The modern reversed coming soon page.
 */
function ModernReversedComingSoonPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-8">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-none sm:min-h-auto sm:w-auto sm:rounded-xl sm:shadow-sm md:w-full md:max-w-6xl">
				<ComingSoonMessageSection />

				<div className="w-full px-4 py-8 sm:w-auto sm:p-12 md:p-16 ltr:border-l-1 rtl:border-r-1">
					<div className="mx-auto flex w-full max-w-80 flex-col items-center justify-center gap-12">
						<ComingSoonPageTitle />

						<FuseCountdown endDate="2071-07-28" />

						<ComingSoonPageForm />
					</div>
				</div>
			</Paper>
		</div>
	);
}

export default ModernReversedComingSoonPageView;
