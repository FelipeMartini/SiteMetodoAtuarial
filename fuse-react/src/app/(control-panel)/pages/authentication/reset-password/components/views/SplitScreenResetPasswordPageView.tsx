import Paper from '@mui/material/Paper';
import ResetPasswordPageTitle from '../ui/ResetPasswordPageTitle';
import ResetPasswordPageForm from '../forms/ResetPasswordPageForm';
import ResetPasswordPageMessageSection from '../ui/ResetPasswordPageMessageSection';

/**
 * The split screen reset password page.
 */
function SplitScreenResetPasswordPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-16 md:shadow-none ltr:border-r-1 rtl:border-l-1">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<ResetPasswordPageTitle />
					<ResetPasswordPageForm />
				</div>
			</Paper>

			<ResetPasswordPageMessageSection />
		</div>
	);
}

export default SplitScreenResetPasswordPageView;
