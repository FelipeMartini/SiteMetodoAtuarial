import Paper from '@mui/material/Paper';
import FuseCountdown from '@fuse/core/FuseCountdown';
import ComingSoonPageTitle from '../ui/ComingSoonPageTitle';
import ComingSoonPageForm from '../forms/ComingSoonPageForm';

/**
 * The classic coming soon page.
 */
function ClassicComingSoonPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
				<div className="mx-auto flex w-full max-w-80 flex-col items-center justify-center gap-12">
					<ComingSoonPageTitle />

					<FuseCountdown endDate="2071-07-28" />

					<ComingSoonPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default ClassicComingSoonPageView;
