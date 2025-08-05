import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';

/**
 * The analytics dashboard app header.
 */
function AnalyticsDashboardAppHeader() {
	return (
		<div className="container flex w-full">
			<div className="flex flex-auto flex-col p-4 pb-0 md:px-8 md:pb-0">
				<PageBreadcrumb className="mb-2" />
				<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center md:gap-0">
					<div className="flex flex-auto flex-col">
						<Typography className="text-3xl font-semibold tracking-tight">Analytics dashboard</Typography>
						<Typography
							className="font-medium tracking-tight"
							color="text.secondary"
						>
							Monitor metrics, check reports and review performance
						</Typography>
					</div>
					<div className="flex items-center gap-2">
						<Button
							className="whitespace-nowrap"
							startIcon={<FuseSvgIcon>lucide:settings</FuseSvgIcon>}
							variant="contained"
							color="primary"
						>
							Settings
						</Button>
						<Button
							className="whitespace-nowrap"
							variant="contained"
							color="secondary"
							startIcon={<FuseSvgIcon>lucide:upload</FuseSvgIcon>}
						>
							Export
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AnalyticsDashboardAppHeader;
