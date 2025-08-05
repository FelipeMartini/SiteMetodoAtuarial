import Paper from '@mui/material/Paper';
import UnlockSessionPageMessageSection from '../ui/UnlockSessionPageMessageSection';
import UnlockSessionPageTitle from '../ui/UnlockSessionPageTitle';
import UnlockSessionPageForm from '../forms/UnlockSessionPageForm';

/**
 * The full screen reversed unlock session page.
 */
function FullScreenReversedUnlockSessionPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<UnlockSessionPageMessageSection />

			<Paper className="h-full w-full px-4 py-8 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:rounded-none md:p-16 md:pt-24 md:shadow-none ltr:border-l-1 rtl:border-r-1">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<UnlockSessionPageTitle />
					<UnlockSessionPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default FullScreenReversedUnlockSessionPageView;
