import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import Paper from '@mui/material/Paper';
import SignOutPageTitle from '../ui/SignOutPageTitle';
import SignOutPageMessageSection from '../ui/SignOutPageMessageSection';

/**
 * The modern reversed sign out page.
 */
function ModernSignOutPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-8">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-none sm:min-h-auto sm:w-auto sm:rounded-xl sm:shadow-sm md:w-full md:max-w-6xl">
				<div className="flex w-full items-center px-4 py-8 sm:w-auto sm:p-12 md:p-16 ltr:border-r-1 rtl:border-l-1">
					<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
						<SignOutPageTitle />

						<Typography
							className="text-md mt-4 text-center font-medium"
							color="text.secondary"
						>
							Go to <Link to="/sign-in">sign in</Link>
						</Typography>
					</div>
				</div>

				<SignOutPageMessageSection />
			</Paper>
		</div>
	);
}

export default ModernSignOutPageView;
