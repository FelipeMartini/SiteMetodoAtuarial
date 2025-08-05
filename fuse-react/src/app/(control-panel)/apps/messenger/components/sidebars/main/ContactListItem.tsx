import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import useNavigate from '@fuse/hooks/useNavigate';
import UserAvatar from '../../ui/UserAvatar';
import { Contact } from '../../../api/types';
import { useChats } from '../../../api/hooks/chats/useChats';
import { useProfile } from '../../../api/hooks/profile/useProfile';
import { useCreateChat } from '../../../api/hooks/chats/useCreateChat';

type ContactListItemProps = {
	item: Contact;
};

/**
 * The contact list item.
 */
function ContactListItem(props: ContactListItemProps) {
	const { item } = props;
	const { data: chatList } = useChats();
	const { mutateAsync: createChat } = useCreateChat();
	const { data: user } = useProfile();

	const navigate = useNavigate();

	function handleClick() {
		const chat = chatList?.find((chat) => chat.contactIds.includes(item.id));

		if (chat) {
			navigate(`/apps/messenger/${chat.id}`);
		} else {
			createChat({ contactIds: [item.id, user.id] }).then((res) => {
				navigate(`/apps/messenger/${res.id}`);
			});
		}
	}

	return (
		<ListItemButton
			className="min-h-9 px-4 md:px-6"
			onClick={handleClick}
		>
			<UserAvatar user={item} />

			<ListItemText
				classes={{
					root: 'min-w-px px-4',
					primary: 'font-medium text-base',
					secondary: 'truncate'
				}}
				primary={item.name}
			/>
		</ListItemButton>
	);
}

export default ContactListItem;
