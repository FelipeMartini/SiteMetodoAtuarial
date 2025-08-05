import Paper from '@mui/material/Paper';
import ResetPasswordPageMessageSection from '../ui/ResetPasswordPageMessageSection';
import ResetPasswordPageTitle from '../ui/ResetPasswordPageTitle';
import ResetPasswordPageForm from '../forms/ResetPasswordPageForm';

/**
 * The split screen reversed reset password page.
 */
function SplitScreenReversedResetPasswordPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<ResetPasswordPageMessageSection />

			<Paper className="h-full w-full px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:rounded-none md:p-16 md:shadow-none ltr:border-l-1 rtl:border-r-1">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<ResetPasswordPageTitle />
					<ResetPasswordPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default SplitScreenReversedResetPasswordPageView;
