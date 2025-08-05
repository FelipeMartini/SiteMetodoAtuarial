import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useState, MouseEvent } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useParams from '@fuse/hooks/useParams';
import ToolbarMenu from './ToolbarMenu';
import { useGetScrumboardBoardLabels } from '../../../../../api/hooks/labels/useGetScrumboardBoardLabels';

type LabelsMenuProps = {
	labels: string[];
	onToggleLabel: (labelId: string) => void;
};

/**
 * The labels menu component.
 */
function LabelsMenu(props: LabelsMenuProps) {
	const { labels, onToggleLabel } = props;

	const routeParams = useParams();
	const { boardId } = routeParams as { boardId: string };

	const { data: labelsArr } = useGetScrumboardBoardLabels(boardId);

	const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);

	function handleMenuOpen(event: MouseEvent<HTMLButtonElement>) {
		setAnchorEl(event.currentTarget);
	}

	function handleMenuClose() {
		setAnchorEl(null);
	}

	return (
		<div>
			<IconButton
				className="rounded-none"
				onClick={handleMenuOpen}
				size="large"
			>
				<FuseSvgIcon>lucide:tag</FuseSvgIcon>
			</IconButton>
			<ToolbarMenu
				state={anchorEl}
				onClose={handleMenuClose}
			>
				<div>
					{labelsArr.map((label) => {
						return (
							<MenuItem
								className="px-2"
								key={label.id}
								onClick={() => {
									onToggleLabel(label.id);
								}}
							>
								<Checkbox checked={labels.includes(label.id)} />
								<ListItemText className="mx-2">{label.title}</ListItemText>
								<ListItemIcon className="min-w-6">
									<FuseSvgIcon>lucide:tag</FuseSvgIcon>
								</ListItemIcon>
							</MenuItem>
						);
					})}
				</div>
			</ToolbarMenu>
		</div>
	);
}

export default LabelsMenu;
