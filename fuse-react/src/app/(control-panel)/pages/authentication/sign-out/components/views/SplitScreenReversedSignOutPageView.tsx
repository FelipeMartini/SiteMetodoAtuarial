import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import Paper from '@mui/material/Paper';
import SignOutPageTitle from '../ui/SignOutPageTitle';
import SignOutPageMessageSection from '../ui/SignOutPageMessageSection';

/**
 * The split screen reversed sign out page.
 */
function SplitScreenReversedSignOutPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<SignOutPageMessageSection />

			<Paper className="flex h-full w-full items-center px-4 py-2 sm:h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm md:flex md:h-full md:w-1/2 md:items-center md:rounded-none md:p-16 md:shadow-none ltr:border-l-1 rtl:border-r-1">
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
		</div>
	);
}

export default SplitScreenReversedSignOutPageView;
