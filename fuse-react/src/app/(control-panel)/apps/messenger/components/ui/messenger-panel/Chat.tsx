import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import InputBase from '@mui/material/InputBase';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Message } from '../../../api/types';
import { useChatMessages } from '../../../api/hooks/chats/useChatMessages';
import { useProfile } from '../../../api/hooks/profile/useProfile';
import { useSendMessage } from '../../../api/hooks/chats/useSendMessage';
import { useMessengerPanelContext } from '../../../contexts/MessengerPanelContext/useMessengerPanelContext';

const StyledMessageRow = styled('div')(({ theme }) => ({
	'&.contact': {
		'& .bubble': {
			backgroundColor: lighten(theme.palette.secondary.main, 0.1),
			color: theme.vars.palette.secondary.contrastText,
			borderRadius: 8,
			'& .time': {
				marginLeft: 12
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
		paddingTop: 20,
		marginTop: 20
	}
}));

type ChatProps = {
	className?: string;
};

/**
 * The chat component.
 */
function Chat(props: ChatProps) {
	const { className } = props;
	const { selectedChatId } = useMessengerPanelContext();

	const { data: chat } = useChatMessages(selectedChatId);
	const { data: user } = useProfile();
	const { mutate: sendMessage } = useSendMessage();
	const { data: messages } = useChatMessages(selectedChatId);

	const [messageText, setMessageText] = useState('');

	const chatScroll = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollToBottom();
	}, [chat]);

	function scrollToBottom() {
		if (!chatScroll.current) {
			return;
		}

		chatScroll.current.scrollTo({
			top: chatScroll.current.scrollHeight,
			behavior: 'instant'
		});
	}

	const onInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
		setMessageText(ev.target.value);
	};

	return (
		<Paper
			className={clsx('relative flex flex-col pb-16 shadow-sm', className)}
			sx={(theme) => ({
				background: theme.vars.palette.background.default
			})}
		>
			<div
				ref={chatScroll}
				className="flex flex-1 flex-col overflow-y-auto overscroll-contain"
			>
				<div className="flex flex-col pt-4">
					{useMemo(() => {
						function isFirstMessageOfGroup(item: Message, i: number) {
							return i === 0 || (chat[i - 1] && chat[i - 1].contactId !== item.contactId);
						}

						function isLastMessageOfGroup(item: Message, i: number) {
							return i === chat.length - 1 || (chat[i + 1] && chat[i + 1].contactId !== item.contactId);
						}

						return messages?.length > 0
							? messages.map((item, i) => {
									return (
										<StyledMessageRow
											key={i}
											className={clsx(
												'relative flex shrink-0 grow-0 flex-col items-start justify-end px-4 pb-1',
												item.contactId === user.id ? 'me' : 'contact',
												{ 'first-of-group': isFirstMessageOfGroup(item, i) },
												{ 'last-of-group': isLastMessageOfGroup(item, i) },
												i + 1 === chat.length && 'pb-10'
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
								})
							: null;
						// eslint-disable-next-line
					}, [chat, user?.id])}
				</div>
				{chat?.length === 0 && (
					<div className="flex flex-1 flex-col items-center justify-center gap-2">
						<FuseSvgIcon
							size={64}
							color="action"
						>
							lucide:message-square-text
						</FuseSvgIcon>
						<Typography
							className="px-4 pb-6 text-center font-medium"
							color="text.secondary"
						>
							Start a conversation by typing your message below.
						</Typography>
					</div>
				)}
			</div>
			{useMemo(() => {
				const onMessageSubmit = (ev: FormEvent) => {
					ev.preventDefault();

					if (messageText === '') {
						return;
					}

					sendMessage({
						message: messageText,
						chatId: selectedChatId
					});
					setMessageText('');
				};
				return (
					chat && (
						<form
							onSubmit={onMessageSubmit}
							className="absolute right-0 bottom-0 left-0 px-2 pb-4"
						>
							<Paper className="relative flex items-center shadow-sm">
								<InputBase
									autoFocus={false}
									id="message-input"
									className="flex flex-1 shrink-0 grow px-3 ltr:mr-12 rtl:ml-12"
									placeholder="Type your message"
									onChange={onInputChange}
									value={messageText}
								/>
								<IconButton
									className="absolute ltr:right-0 rtl:left-0"
									type="submit"
								>
									<FuseSvgIcon
										className=""
										color="action"
									>
										lucide:send
									</FuseSvgIcon>
								</IconButton>
							</Paper>
						</form>
					)
				);
			}, [chat, messageText, selectedChatId, sendMessage])}
		</Paper>
	);
}

export default Chat;
