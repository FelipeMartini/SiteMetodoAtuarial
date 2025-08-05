import Paper from '@mui/material/Paper';
import SignInPageForm from '../forms/SignInPageForm';
import SignInPageTitle from '../ui/SignInPageTitle';
import SignInPageMessageSection from '../ui/SignInPageMessageSection';

/**
 * The full screen reversed sign in page.
 */
function ModernSignInPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-8">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-none sm:min-h-auto sm:w-auto sm:rounded-xl sm:shadow-sm md:w-full md:max-w-6xl">
				<div className="w-full px-4 py-8 sm:w-auto sm:p-12 md:p-16 ltr:border-r-1 rtl:border-l-1">
					<div className="mx-auto flex w-full max-w-80 flex-col gap-8 sm:mx-0 sm:w-80">
						<SignInPageTitle />
						<SignInPageForm />
					</div>
				</div>
				<SignInPageMessageSection />
			</Paper>
		</div>
	);
}

export default ModernSignInPageView;
