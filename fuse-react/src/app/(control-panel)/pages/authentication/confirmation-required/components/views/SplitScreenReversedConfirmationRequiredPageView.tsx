import Paper from '@mui/material/Paper';
import ConfirmationRequiredPageMessageSection from '../ui/ConfirmationRequiredPageMessageSection';
import ConfirmationRequiredPageTitle from '../ui/ConfirmationRequiredPageTitle';

/**
 * The split screen confirmation required page.
 */
function SplitScreenReversedConfirmationRequiredPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<ConfirmationRequiredPageMessageSection />

			<Paper className="h-full w-full px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:rounded-none md:p-16 md:shadow-none ltr:border-l-1 rtl:border-r-1">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<ConfirmationRequiredPageTitle />
				</div>
			</Paper>
		</div>
	);
}

export default SplitScreenReversedConfirmationRequiredPageView;
