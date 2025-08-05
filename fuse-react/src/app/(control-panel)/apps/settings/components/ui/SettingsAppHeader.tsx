import _ from 'lodash';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import usePathname from '@fuse/hooks/usePathname';
import SettingsAppNavigation from '../../lib/constants/SettingsAppNavigation';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

type SettingsAppHeaderProps = {
	className?: string;
	onSetSidebarOpen: (open: boolean) => void;
};

function SettingsAppHeader(props: SettingsAppHeaderProps) {
	const { className, onSetSidebarOpen } = props;
	const pathname = usePathname();
	const currentNavigation = _.find(SettingsAppNavigation.children, { url: pathname });
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<div className={clsx('flex flex-col', className)}>
			<PageBreadcrumb className="mb-2" />
			<div className="flex items-center gap-2">
				{isMobile && (
					<IconButton
						className="border-divider border"
						onClick={() => onSetSidebarOpen(true)}
						aria-label="open left sidebar"
					>
						<FuseSvgIcon>lucide:menu</FuseSvgIcon>
					</IconButton>
				)}
				<Typography className="text-3xl leading-none font-bold tracking-tight lg:ml-0">
					{currentNavigation?.title}
				</Typography>
			</div>
		</div>
	);
}

export default SettingsAppHeader;
