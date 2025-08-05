import Paper from '@mui/material/Paper';
import ResetPasswordPageForm from '../forms/ResetPasswordPageForm';
import ResetPasswordPageTitle from '../ui/ResetPasswordPageTitle';
import ResetPasswordPageMessageSection from '../ui/ResetPasswordPageMessageSection';

/**
 * The modern reset password page.
 */
function ModernReversedResetPasswordPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-8">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-none sm:min-h-auto sm:w-auto sm:rounded-xl sm:shadow-sm md:w-full md:max-w-6xl">
				<ResetPasswordPageMessageSection />

				<div className="w-full px-4 py-8 sm:w-auto sm:p-12 md:p-16 ltr:border-l-1 rtl:border-r-1">
					<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
						<ResetPasswordPageTitle />
						<ResetPasswordPageForm />
					</div>
				</div>
			</Paper>
		</div>
	);
}

export default ModernReversedResetPasswordPageView;
