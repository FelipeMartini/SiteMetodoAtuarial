import Paper from '@mui/material/Paper';
import UnlockSessionPageMessageSection from '../ui/UnlockSessionPageMessageSection';
import UnlockSessionPageForm from '../forms/UnlockSessionPageForm';
import UnlockSessionPageTitle from '../ui/UnlockSessionPageTitle';

/**
 * The split screen reversed unlock session page.
 */
function SplitScreenReversedUnlockSessionPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<UnlockSessionPageMessageSection />
			<Paper className="h-full w-full px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:rounded-none md:p-16 md:shadow-none ltr:border-l-1 rtl:border-r-1">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<UnlockSessionPageTitle />
					<UnlockSessionPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default SplitScreenReversedUnlockSessionPageView;
