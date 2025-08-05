import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { darken } from '@mui/material/styles';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useUser from '@auth/useUser';

/**
 * The ProjectDashboardAppHeader page.
 */
function ProjectDashboardAppHeader() {
	const { data: user, isGuest } = useUser();

	return (
		<div className="flex flex-auto flex-col px-4 pt-4 sm:px-8">
			<PageBreadcrumb className="mb-2" />
			<div className="flex min-w-0 flex-auto flex-col gap-2 sm:flex-row sm:items-center">
				<div className="flex flex-auto items-center gap-2">
					<Avatar
						sx={(theme) => ({
							background: (theme) => darken(theme.palette.background.default, 0.05),
							color: theme.vars.palette.text.secondary
						})}
						className="h-12 w-12 shrink-0"
						alt="user photo"
						src={user?.photoURL}
					>
						{user?.displayName?.[0]}
					</Avatar>
					<div className="flex min-w-0 flex-col">
						<Typography className="truncate text-xl leading-7 font-semibold tracking-tight md:text-3xl md:leading-[1.375]">
							{isGuest ? 'Hi Guest!' : `Welcome back, ${user?.displayName || user?.email}!`}
						</Typography>

						<div className="flex items-center gap-1">
							<FuseSvgIcon color="action">lucide:bell</FuseSvgIcon>
							<Typography
								className="text-md truncate"
								color="text.secondary"
							>
								You have 2 new messages and 15 new tasks
							</Typography>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="primary"
						startIcon={<FuseSvgIcon>lucide:mail</FuseSvgIcon>}
					>
						Messages
					</Button>
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon>lucide:settings</FuseSvgIcon>}
					>
						Settings
					</Button>
				</div>
			</div>
		</div>
	);
}

export default ProjectDashboardAppHeader;
