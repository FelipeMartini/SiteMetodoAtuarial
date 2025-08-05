import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import BoardTitle from './BoardTitle';
import BoardSettingsPopover from './popovers/settings/BoardSettingsPopover';

/**
 * The board header component.
 */
function BoardHeader() {
	return (
		<div className="container flex w-full">
			<div className="flex flex-auto flex-col p-4 pb-0 md:px-6 md:pb-0">
				<PageBreadcrumb className="mb-2" />
				<div className="flex min-w-0 flex-auto items-center">
					<div className="flex flex-auto flex-col">
						<BoardTitle />
					</div>
					<div className="flex items-center gap-2 sm:mx-2 sm:mt-0">
						<Button
							className="whitespace-nowrap"
							component={NavLinkAdapter}
							to="/apps/scrumboard/boards/"
							startIcon={<FuseSvgIcon>lucide:columns-3</FuseSvgIcon>}
						>
							Boards
						</Button>

						<BoardSettingsPopover />
					</div>
				</div>
			</div>
		</div>
	);
}

export default BoardHeader;
