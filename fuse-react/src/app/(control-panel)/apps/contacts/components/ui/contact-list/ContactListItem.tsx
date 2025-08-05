import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Contact } from '../../../api/types';

type ContactListItemPropsType = {
	contact: Contact;
};

/**
 * The contact list item.
 */
function ContactListItem(props: ContactListItemPropsType) {
	const { contact } = props;

	return (
		<>
			<ListItemButton
				className="border-divider border-b-1 px-4 py-4 md:px-8"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/apps/contacts/${contact.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={contact.name}
						src={contact.avatar}
					/>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={contact.name}
					secondary={
						<Typography
							className="inline"
							component="span"
							variant="body2"
							color="text.secondary"
						>
							{contact.title}
						</Typography>
					}
				/>
			</ListItemButton>
		</>
	);
}

export default ContactListItem;
