import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { motion } from 'motion/react';
import { memo, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { Box, CircularProgress } from '@mui/material';
import ContactButton from './ContactButton';
import { useCreateChat } from '../../../api/hooks/chats/useCreateChat';
import { useChats } from '../../../api/hooks/chats/useChats';
import { useContacts } from '../../../api/hooks/contacts/useContacts';
import { useProfile } from '../../../api/hooks/profile/useProfile';
import { useMessengerPanelContext } from '../../../contexts/MessengerPanelContext/useMessengerPanelContext';
const Root = styled(FuseScrollbars)(({ theme }) => ({
	background: theme.vars.palette.background.paper
}));

const container = {
	show: {
		transition: {
			staggerChildren: 0.025
		}
	}
};
const item = {
	hidden: { opacity: 0, scale: 0.6 },
	show: { opacity: 1, scale: 1 }
};

type ContactListProps = {
	className?: string;
};

/**
 * The contact list.
 */
function ContactList(props: ContactListProps) {
	const { className } = props;
	const { selectedChatId, openChatPanel, setSelectedChatId } = useMessengerPanelContext();
	const contactListScroll = useRef<HTMLDivElement>(null);
	const { data: user } = useProfile();

	const { mutateAsync: createChat } = useCreateChat();
	const { data: chats, isLoading: isChatsLoading } = useChats();
	const { data: contacts, isLoading: isContactsLoading } = useContacts();
	const { data: chatList } = useChats();

	const chatListContacts = useMemo(() => {
		return contacts?.length > 0 && chats?.length > 0
			? chats.map((_chat) => ({
					..._chat,
					...contacts.find((_contact) => _chat.contactIds.includes(_contact.id))
				}))
			: [];
	}, [contacts, chats]);

	const scrollToTop = () => {
		if (!contactListScroll.current) {
			return;
		}

		contactListScroll.current.scrollTop = 0;
	};

	const handleContactClick = (contactId: string) => {
		openChatPanel();

		const chat = chatList?.find((chat) => chat.contactIds.includes(contactId));

		if (chat) {
			setSelectedChatId(chat.id);
			scrollToTop();
		} else {
			createChat({ contactIds: [contactId, user.id] }).then((res) => {
				setSelectedChatId(res.id);
				scrollToTop();
			});
		}
	};

	if (isContactsLoading || isChatsLoading) {
		return (
			<Box
				className="flex justify-center py-3"
				sx={{
					width: 70,
					minWidth: 70
				}}
			>
				<CircularProgress color="secondary" />
			</Box>
		);
	}

	return (
		<Root
			className={clsx('flex shrink-0 flex-col overflow-y-auto overscroll-contain py-2', className)}
			ref={contactListScroll}
			option={{ suppressScrollX: true, wheelPropagation: false }}
		>
			{contacts?.length > 0 && (
				<motion.div
					variants={container}
					initial="hidden"
					animate="show"
					className="flex shrink-0 flex-col"
				>
					{chatListContacts &&
						chatListContacts.map((contact) => {
							return (
								<motion.div
									variants={item}
									key={contact.id}
								>
									<ContactButton
										contact={contact}
										selectedChatId={selectedChatId}
										onClick={handleContactClick}
									/>
								</motion.div>
							);
						})}
					<Divider className="mx-6 my-2" />
					{contacts.map((contact) => {
						const chatContact = chats.find((_chat) => _chat.contactIds.includes(contact.id));

						return !chatContact ? (
							<motion.div
								variants={item}
								key={contact.id}
							>
								<ContactButton
									contact={contact}
									selectedChatId={selectedChatId}
									onClick={handleContactClick}
								/>
							</motion.div>
						) : null;
					})}
				</motion.div>
			)}
		</Root>
	);
}

export default memo(ContactList);
