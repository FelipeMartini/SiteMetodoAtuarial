import Paper from '@mui/material/Paper';
import SignInPageTitle from '../ui/SignInPageTitle';
import SignInPageForm from '../forms/SignInPageForm';

/**
 * The classic sign in page.
 */
function ClassicSignInPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
				<div className="mx-auto flex w-full max-w-80 flex-col gap-8 sm:mx-0 sm:w-80">
					<SignInPageTitle />
					<SignInPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default ClassicSignInPageView;
