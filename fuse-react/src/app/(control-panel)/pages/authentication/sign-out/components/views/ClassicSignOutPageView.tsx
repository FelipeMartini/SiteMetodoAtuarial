import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import Paper from '@mui/material/Paper';
import SignOutPageTitle from '../ui/SignOutPageTitle';

/**
 * The sign out page.
 */
function ClassicSignOutPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="flex min-h-full w-full items-center rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
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

export default ClassicSignOutPageView;
