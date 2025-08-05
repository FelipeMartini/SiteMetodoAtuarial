'use client';
import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { useEffect, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Toolbar from '@mui/material/Toolbar';
import useParams from '@fuse/hooks/useParams';
import Box from '@mui/material/Box';
import Error404PageView from '@/app/(public)/(errors)/components/views/Error404PageView';
import ChatMoreMenu from '../ui/chat/ChatMoreMenu';
import { useChats } from '../../api/hooks/chats/useChats';
import { useChatMessages } from '../../api/hooks/chats/useChatMessages';
import { useContact } from '../../api/hooks/contacts/useContact';
import { useProfile } from '../../api/hooks/profile/useProfile';
import { useSendMessage } from '../../api/hooks/chats/useSendMessage';
import UserAvatar from '../ui/UserAvatar';
import { useMessengerAppContext } from '../../contexts/MessengerAppContext/useMessengerAppContext';
import { Message } from '../../api/types';
import FuseLoading from '@fuse/core/FuseLoading';

const StyledMessageRow = styled('div')(({ theme }) => ({
	'&.contact': {
		'& .bubble': {
			backgroundColor: lighten(theme.palette.secondary.main, 0.1),
			color: theme.vars.palette.secondary.contrastText,
			borderRadius: 8,
			'& .time': {
				paddingLeft: 12
			}
		},
		'&.last-of-group': {
			'& .bubble': {
				borderBottomLeftRadius: 3
			}
		}
	},
	'&.me': {
		paddingLeft: 36,
		'& .bubble': {
			marginLeft: 'auto',
			backgroundColor: lighten(theme.palette.primary.main, 0.1),
			color: theme.vars.palette.primary.contrastText,
			borderRadius: 8,
			'& .time': {
				justifyContent: 'flex-end',
				right: 0,
				paddingRight: 12
			}
		},
		'&.last-of-group': {
			'& .bubble': {
				borderBottomRightRadius: 3
			}
		}
	},
	'&.contact + .me, &.me + .contact': {
		paddingTop: 8,
		marginTop: 8
	}
}));

type MessengerChatViewProps = {
	className?: string;
};

/**
 * The MessengerChatView.
 */
function MessengerChatView(props: MessengerChatViewProps) {
	const { className } = props;
	const { setMainSidebarOpen, setContactSidebarOpen } = useMessengerAppContext();
	const chatRef = useRef<HTMLDivElement>(null);
	const [message, setMessage] = useState('');

	const routeParams = useParams<{ chatId: string }>();
	const { chatId } = routeParams;

	const { data: chatList, isLoading: isChatsLoading } = useChats();

	const chat = chatList?.find((chat) => chat.id === chatId);

	const { data: user, isLoading: isUserLoading } = useProfile();
	const { data: messages, isLoading: isMessagesLoading } = useChatMessages(chatId);

	const contactId = chat?.contactIds?.find((id) => id !== user?.id);

	const { data: selectedContact } = useContact(contactId);
	const { mutate: sendMessage } = useSendMessage();

	useEffect(() => {
		if (messages) {
			setTimeout(scrollToBottom);
		}
	}, [messages]);

	function scrollToBottom() {
		if (!chatRef.current) {
			return;
		}

		chatRef.current.scrollTo({
			top: chatRef.current.scrollHeight,
			behavior: 'smooth'
		});
	}

	function isFirstMessageOfGroup(item: Message, i: number) {
		return i === 0 || (messages[i - 1] && messages[i - 1].contactId !== item.contactId);
	}

	function isLastMessageOfGroup(item: Message, i: number) {
		return i === messages.length - 1 || (messages[i + 1] && messages[i + 1].contactId !== item.contactId);
	}

	function onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
		setMessage(ev.target.value);
	}

	function onMessageSubmit(ev: React.FormEvent<HTMLFormElement>) {
		ev.preventDefault();

		if (message === '') {
			return;
		}

		sendMessage({
			message,
			chatId
		});

		setMessage('');
	}

	if (isUserLoading || isChatsLoading || isMessagesLoading) {
		return <FuseLoading />;
	}

	if (!user || !messages || !chat) {
		return <Error404PageView />;
	}

	return (
		<>
			<Box
				className="w-full border-b-1"
				sx={(theme) => ({
					backgroundColor: lighten(theme.palette.background.default, 0.02),
					...theme.applyStyles('light', {
						backgroundColor: lighten(theme.palette.background.default, 0.4)
					})
				})}
			>
				<Toolbar className="flex w-full items-center justify-between px-4">
					<div className="flex items-center">
						<IconButton
							aria-label="Open drawer"
							onClick={() => setMainSidebarOpen(true)}
							className="border-divider flex border lg:hidden"
						>
							<FuseSvgIcon>lucide:message-square-text</FuseSvgIcon>
						</IconButton>
						<div
							className="flex cursor-pointer items-center"
							onClick={() => {
								setContactSidebarOpen(contactId);
							}}
							onKeyDown={() => setContactSidebarOpen(contactId)}
							role="button"
							tabIndex={0}
						>
							<UserAvatar
								className="relative mx-2"
								user={selectedContact}
							/>
							<Typography
								color="inherit"
								className="px-1 text-lg font-semibold"
							>
								{selectedContact?.name}
							</Typography>
						</div>
					</div>
					<ChatMoreMenu
						className="-mx-2"
						contactId={contactId}
					/>
				</Toolbar>
			</Box>
			<div className="flex h-full min-h-0 w-full flex-auto">
				<div className={clsx('relative z-10 flex flex-1 flex-col', className)}>
					<div
						ref={chatRef}
						className="flex flex-1 flex-col overflow-y-auto"
					>
						{messages?.length > 0 && (
							<div className="flex flex-col pt-4 pb-10 md:px-4">
								{messages.map((item, i) => {
									return (
										<StyledMessageRow
											key={i}
											className={clsx(
												'relative flex shrink-0 grow-0 flex-col items-start justify-end px-4 pb-1',
												item.contactId === user.id ? 'me' : 'contact',
												{ 'first-of-group': isFirstMessageOfGroup(item, i) },
												{ 'last-of-group': isLastMessageOfGroup(item, i) },
												i + 1 === messages.length && 'pb-18'
											)}
										>
											<div className="bubble relative flex max-w-full items-center justify-center px-3 py-2">
												<Typography className="text-md whitespace-pre-wrap">
													{item.value}
												</Typography>
												<Typography
													className="time absolute bottom-0 -mb-5 hidden w-full text-sm whitespace-nowrap ltr:left-0 rtl:right-0"
													color="text.secondary"
												>
													{formatDistanceToNow(new Date(item.createdAt), {
														addSuffix: true
													})}
												</Typography>
											</div>
										</StyledMessageRow>
									);
								})}
							</div>
						)}
					</div>
					{messages && (
						<Paper
							square
							component="form"
							onSubmit={onMessageSubmit}
							className="absolute right-0 bottom-0 left-0 border-t-1 px-4 py-4"
							sx={(theme) => ({
								backgroundColor: lighten(theme.palette.background.default, 0.02),
								...theme.applyStyles('light', {
									backgroundColor: lighten(theme.palette.background.default, 0.4)
								})
							})}
						>
							<div className="relative flex items-center">
								<IconButton type="submit">
									<FuseSvgIcon
										className="text-3xl"
										color="action"
									>
										lucide:smile
									</FuseSvgIcon>
								</IconButton>

								<IconButton type="submit">
									<FuseSvgIcon
										className="text-3xl"
										color="action"
									>
										lucide:paperclip
									</FuseSvgIcon>
								</IconButton>

								<InputBase
									autoFocus={false}
									id="message-input"
									className="mx-2 flex flex-1 shrink-0 grow rounded-lg border-1 px-2"
									placeholder="Type your message"
									onChange={onInputChange}
									value={message}
									sx={{ backgroundColor: 'background.paper' }}
								/>
								<IconButton type="submit">
									<FuseSvgIcon color="action">lucide:send</FuseSvgIcon>
								</IconButton>
							</div>
						</Paper>
					)}
				</div>
			</div>
		</>
	);
}

export default MessengerChatView;
