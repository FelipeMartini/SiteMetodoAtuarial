import Paper from '@mui/material/Paper';
import ResetPasswordPageForm from '../forms/ResetPasswordPageForm';
import ResetPasswordPageTitle from '../ui/ResetPasswordPageTitle';

/**
 * The classic reset password page.
 */
function ClassicResetPasswordPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<ResetPasswordPageTitle />
					<ResetPasswordPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default ClassicResetPasswordPageView;
