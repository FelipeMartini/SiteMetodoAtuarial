import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import ContactStatus from './ContactStatus';
import { Chat, Contact } from '../../../api/types';
import UserAvatar from '../UserAvatar';

const Root = styled(Tooltip)<{ active: number }>(({ theme }) => ({
	width: 70,
	minWidth: 70,
	flex: '0 0 auto',
	variants: [
		{
			props: ({ active }) => active,
			style: {
				'&:after': {
					position: 'absolute',
					top: 8,
					right: 0,
					bottom: 8,
					content: "''",
					width: 4,
					borderTopLeftRadius: 4,
					borderBottomLeftRadius: 4,
					backgroundColor: theme.vars.palette.primary.main
				}
			}
		}
	]
}));

const StyledUreadBadge = styled('div')(({ theme }) => ({
	position: 'absolute',
	minWidth: 18,
	height: 18,
	top: 4,
	left: 10,
	borderRadius: 9,
	padding: '0 5px',
	fontSize: 11,
	textAlign: 'center',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: theme.vars.palette.secondary.main,
	color: theme.vars.palette.secondary.contrastText,
	boxShadow: '0 2px 2px 0 rgba(0, 0, 0, 0.35)',
	zIndex: 10
}));

type ContactButtonProps = {
	contact: Partial<Contact & Chat>;
	selectedChatId: string;
	onClick: (id: string) => void;
};

/**
 * Contact button component.
 */
function ContactButton(props: ContactButtonProps) {
	const { contact, selectedChatId, onClick } = props;

	if (!contact) {
		return null;
	}

	return (
		<Root
			title={contact.name}
			placement="left"
			active={selectedChatId === contact.id ? 1 : 0}
		>
			<Button
				onClick={() => onClick(contact.id)}
				className={clsx(
					'contactButton h-auto max-h-none min-h-auto rounded-none py-1',
					selectedChatId === contact.id && 'active'
				)}
			>
				{Boolean(contact.unreadCount) && <StyledUreadBadge>{contact.unreadCount}</StyledUreadBadge>}

				<ContactStatus value={contact.status} />

				<UserAvatar user={contact} />
			</Button>
		</Root>
	);
}

export default ContactButton;
