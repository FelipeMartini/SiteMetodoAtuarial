import Paper from '@mui/material/Paper';

import SignUpPageTitle from '../ui/SignUpPageTitle';
import SignUpPageForm from '../forms/SignUpPageForm';
import SignUpPageMessageSection from '../ui/SignUpPageMessageSection';

/**
 * The full screen reversed sign up page.
 */
function FullScreenReversedSignUpPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<SignUpPageMessageSection />
			<Paper className="h-full w-full px-4 py-8 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:rounded-none md:p-16 md:pt-24 md:shadow-none ltr:border-l-1 rtl:border-r-1">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<SignUpPageTitle />
					<SignUpPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default FullScreenReversedSignUpPageView;
