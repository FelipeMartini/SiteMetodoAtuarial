import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import NotesSearch from './NotesSearch';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useNotesAppContext } from '../../contexts/NotesAppContext/useNotesAppContext';

type NotesHeaderProps = {
	onSetSidebarOpen: (open: boolean) => void;
};

/**
 * The notes header.
 */
function NotesHeader(props: NotesHeaderProps) {
	const { onSetSidebarOpen } = props;
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const { variateDesc, toggleVariateDescSize } = useNotesAppContext();

	return (
		<div className="container flex w-full">
			<div className="flex flex-auto flex-col py-4">
				<PageBreadcrumb className="mb-2" />
				<div className="flex min-w-0 flex-auto flex-col sm:flex-row sm:items-center">
					<div className="flex flex-auto flex-col">
						<Typography className="text-3xl leading-none font-extrabold tracking-tight">Notes</Typography>
						<Typography
							className="font-medium tracking-tight"
							color="text.secondary"
						>
							Capture and organize your thoughts and ideas
						</Typography>
					</div>
					<div className="mt-2 flex items-center gap-2 sm:mx-2 sm:mt-0">
						{isMobile && (
							<IconButton
								onClick={() => onSetSidebarOpen(true)}
								aria-label="open left sidebar"
								className="border-divider border"
							>
								<FuseSvgIcon>lucide:menu</FuseSvgIcon>
							</IconButton>
						)}

						<Tooltip title="Toggle Variate Description Size">
							<IconButton
								className="border-divider border"
								onClick={() => toggleVariateDescSize()}
							>
								<FuseSvgIcon color={variateDesc ? 'action' : 'disabled'}>
									lucide:arrow-down-up
								</FuseSvgIcon>
							</IconButton>
						</Tooltip>
						<NotesSearch />
					</div>
				</div>
			</div>
		</div>
	);
}

export default NotesHeader;
