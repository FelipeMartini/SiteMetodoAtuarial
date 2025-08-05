import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { NavLinkAdapterPropsType } from '@fuse/core/NavLinkAdapter/NavLinkAdapter';
import { PartialDeep } from 'type-fest';
import { useLabels } from '../../api/hooks/labels/useLabels';
import { useNotesAppContext } from '../../contexts/NotesAppContext/useNotesAppContext';

const StyledListItemButton = styled(ListItemButton)<ListItemButtonProps & PartialDeep<NavLinkAdapterPropsType>>(
	({ theme }) => ({
		color: 'inherit!important',
		textDecoration: 'none!important',
		height: 36,
		width: '100%',
		borderRadius: 8,
		paddingLeft: 12,
		paddingRight: 12,
		marginBottom: 8,
		fontWeight: 500,
		'&.active': {
			backgroundColor: 'rgba(255, 255, 255, .1)!important',
			pointerEvents: 'none',
			'& .list-item-icon': {
				color: theme.vars.palette.secondary.main
			},
			...theme.applyStyles('light', {
				backgroundColor: 'rgba(0, 0, 0, .05)!important'
			})
		},
		'& .list-item-icon': {
			marginRight: 12
		}
	})
);

/**
 * The notes sidebar content.
 */
function NotesSidebarContent() {
	const { openLabelsDialog } = useNotesAppContext();
	const { data: labels, isLoading } = useLabels();

	if (isLoading) {
		return null;
	}

	return (
		<div className="w-full p-4">
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			>
				<List>
					<StyledListItemButton
						component={NavLinkAdapter}
						to="/apps/notes/all"
						activeClassName="active"
					>
						<FuseSvgIcon className="list-item-icon">lucide:square-pen</FuseSvgIcon>
						<ListItemText
							className="truncate"
							primary="Notes"
							disableTypography
						/>
					</StyledListItemButton>
					<StyledListItemButton
						component={NavLinkAdapter}
						to="/apps/notes/reminders"
						activeClassName="active"
					>
						<FuseSvgIcon className="list-item-icon">lucide:bell</FuseSvgIcon>
						<ListItemText
							className="truncate"
							primary="Reminders"
							disableTypography
						/>
					</StyledListItemButton>

					<StyledListItemButton
						component={NavLinkAdapter}
						to="/apps/notes/archive"
						activeClassName="active"
					>
						<FuseSvgIcon className="list-item-icon">lucide:archive</FuseSvgIcon>
						<ListItemText
							className="truncate"
							primary="Archive"
							disableTypography
						/>
					</StyledListItemButton>

					{labels?.map((label) => (
						<StyledListItemButton
							key={label.id}
							component={NavLinkAdapter}
							to={`/apps/notes/labels/${label.id}`}
							activeClassName="active"
						>
							<FuseSvgIcon className="list-item-icon">lucide:tag</FuseSvgIcon>
							<ListItemText
								className="truncate"
								primary={label.title}
								disableTypography
							/>
						</StyledListItemButton>
					))}
					<StyledListItemButton onClick={() => openLabelsDialog()}>
						<FuseSvgIcon className="list-item-icon">lucide:pencil</FuseSvgIcon>
						<ListItemText
							className="truncate"
							primary="Edit Labels"
							disableTypography
						/>
					</StyledListItemButton>
				</List>
			</motion.div>
		</div>
	);
}

export default NotesSidebarContent;
