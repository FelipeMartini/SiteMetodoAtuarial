import { styled } from '@mui/material/styles';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns/format';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { NavLinkAdapterPropsType } from '@fuse/core/NavLinkAdapter/NavLinkAdapter';
import UserAvatar from '../../ui/UserAvatar';
import { Chat, Contact } from '../../../api/types';
import { useContacts } from '../../../api/hooks/contacts/useContacts';
import { useProfile } from '../../../api/hooks/profile/useProfile';

type ExtendedListItemProps = NavLinkAdapterPropsType & {
	component: React.ElementType<NavLinkAdapterPropsType>;
};

const StyledListItem = styled(ListItemButton)<ExtendedListItemProps>(({ theme }) => ({
	'&.active': {
		backgroundColor: theme.vars.palette.background.default
	}
}));

type ChatListItemProps = {
	item: Partial<Contact & Chat>;
};

/**
 * The chat list item.
 */
function ChatListItem(props: ChatListItemProps) {
	const { item } = props;
	const { data: user } = useProfile();
	const { data: contacts } = useContacts();

	const contactId = item.contactIds.find((id) => id !== user?.id);
	const contact = contacts?.find((contact) => contact.id === contactId);

	return (
		<StyledListItem
			component={NavLinkAdapter}
			className="min-h-9 px-4 md:px-6"
			to={`/apps/messenger/${item.id}`}
			activeClassName="active"
		>
			<UserAvatar user={contact} />

			<ListItemText
				classes={{
					root: 'min-w-px px-4',
					primary: 'font-medium text-base',
					secondary: 'truncate'
				}}
				primary={contact?.name}
				secondary={item.lastMessage}
			/>

			{contactId && (
				<div className="flex flex-col items-end justify-center">
					{item?.lastMessageAt && (
						<Typography
							className="text-md mb-2 font-medium whitespace-nowrap"
							color="text.secondary"
						>
							{format(new Date(item.lastMessageAt), 'PP')}
						</Typography>
					)}
					<div className="items-center">
						{item.muted && (
							<FuseSvgIcon
								size={20}
								color="disabled"
							>
								lucide:volume-off
							</FuseSvgIcon>
						)}
						{Boolean(item.unreadCount) && (
							<Box
								sx={{
									backgroundColor: 'secondary.main',
									color: 'secondary.contrastText'
								}}
								className="flex h-5 min-w-5 items-center justify-center rounded-full text-center text-xs font-medium"
							>
								{item.unreadCount}
							</Box>
						)}
					</div>
				</div>
			)}
		</StyledListItem>
	);
}

export default ChatListItem;
