import Paper from '@mui/material/Paper';
import UnlockSessionPageTitle from '../ui/UnlockSessionPageTitle';
import UnlockSessionPageForm from '../forms/UnlockSessionPageForm';

/**
 * The classic unlock session page.
 */
function ClassicUnlockSessionPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center">
			<Paper className="min-h-full w-full rounded-none px-4 py-8 sm:min-h-auto sm:w-auto sm:rounded-xl sm:p-12 sm:shadow-sm">
				<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
					<UnlockSessionPageTitle />
					<UnlockSessionPageForm />
				</div>
			</Paper>
		</div>
	);
}

export default ClassicUnlockSessionPageView;
