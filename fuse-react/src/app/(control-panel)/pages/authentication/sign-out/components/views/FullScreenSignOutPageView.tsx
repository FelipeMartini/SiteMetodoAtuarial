import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import Paper from '@mui/material/Paper';
import SignOutPageTitle from '../ui/SignOutPageTitle';
import SignOutPageMessageSection from '../ui/SignOutPageMessageSection';

/**
 * The full screen sign out page.
 */
function FullScreenSignOutPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="flex h-full w-full items-center px-4 py-8 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:justify-end md:rounded-none md:p-16 md:pt-24 md:shadow-none ltr:border-r-1 rtl:border-l-1">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<SignOutPageTitle />

					<Typography
						className="text-md mt-4 text-center font-medium"
						color="text.secondary"
					>
						Go to <Link to="/sign-in">sign in</Link>
					</Typography>
				</div>
			</Paper>

			<SignOutPageMessageSection />
		</div>
	);
}

export default FullScreenSignOutPageView;
