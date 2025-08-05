import Paper from '@mui/material/Paper';
import UnlockSessionPageForm from '../forms/UnlockSessionPageForm';
import UnlockSessionPageTitle from '../ui/UnlockSessionPageTitle';
import UnlockSessionPageMessageSection from '../ui/UnlockSessionPageMessageSection';

/**
 * The modern reversed unlock session page.
 */
function ModernReversedUnlockSessionPageView() {
	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:justify-center md:p-8">
			<Paper className="flex min-h-full w-full overflow-hidden rounded-none sm:min-h-auto sm:w-auto sm:rounded-xl sm:shadow-sm md:w-full md:max-w-6xl">
				<UnlockSessionPageMessageSection />

				<div className="w-full px-4 py-8 sm:w-auto sm:p-12 md:p-16 ltr:border-l-1 rtl:border-r-1">
					<div className="mx-auto w-full max-w-80 sm:mx-0 sm:w-80">
						<UnlockSessionPageTitle />
						<UnlockSessionPageForm />
					</div>
				</div>
			</Paper>
		</div>
	);
}

export default ModernReversedUnlockSessionPageView;
