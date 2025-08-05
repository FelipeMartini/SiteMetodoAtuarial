import AppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import keycode from 'keycode';
import { useCallback, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from 'lodash';
import Chat from '../ui/messenger-panel/Chat';
import ContactList from '../ui/messenger-panel/ContactList';
import { useContacts } from '../../api/hooks/contacts/useContacts';
import { useChats } from '../../api/hooks/chats/useChats';
import { useProfile } from '../../api/hooks/profile/useProfile';
import { MessengerPanelContextProvider } from '../../contexts/MessengerPanelContext/MessengerPanelContextProvider';
import { useMessengerPanelContext } from '../../contexts/MessengerPanelContext/useMessengerPanelContext';

const Root = styled('div')<{ opened: number }>(({ theme }) => ({
	position: 'sticky',
	display: 'flex',
	top: 0,
	width: 70,
	maxWidth: 70,
	minWidth: 70,
	height: '100vh',
	zIndex: 1000,
	borderLeft: `1px solid ${theme.vars.palette.divider}`,
	[theme.breakpoints.down('lg')]: {
		position: 'fixed',
		height: '100%',
		width: 0,
		maxWidth: 0,
		minWidth: 0
	},
	'& > .panel': {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		width: 360,
		minWidth: 360,
		height: '100%',
		margin: 0,
		overflow: 'hidden',
		zIndex: 1000,
		backgroundColor: theme.vars.palette.background.paper,
		boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
		transform: 'translate3d(0,0,0)',
		transition: theme.transitions.create(['transform'], {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.standard
		}),
		[theme.breakpoints.down('lg')]: {
			left: 'auto',
			position: 'fixed',
			transform: theme.direction === 'rtl' ? 'translate3d(-360px,0,0)' : 'translate3d(360px,0,0)',
			boxShadow: 'none',
			width: 320,
			minWidth: 320,
			maxWidth: '100%'
		}
	},
	'@keyframes hide-panel': {
		'0%': {
			overflow: 'visible'
		},
		'99%': {
			overflow: 'visible'
		},
		'100%': {
			overflow: 'hidden'
		}
	},
	variants: [
		{
			props: ({ opened }) => opened,
			style: {
				overflow: 'visible'
			}
		},
		{
			props: ({ opened }) => !opened,
			style: {
				overflow: 'hidden',
				animation: `hide-panel 1ms linear ${theme.transitions.duration.standard}`,
				animationFillMode: 'forwards'
			}
		},
		{
			props: ({ opened }) => opened,
			style: {
				'& > .panel': {
					transform: theme.direction === 'rtl' ? 'translate3d(290px,0,0)' : 'translate3d(-290px,0,0)'
				}
			}
		},
		{
			props: ({ opened }) => opened,
			style: {
				'& > .panel': {
					[theme.breakpoints.down('lg')]: {
						transform: 'translate3d(0,0,0)',
						boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
					}
				}
			}
		}
	]
}));

/**
 * The chat panel component.
 */
function MessengerPanel() {
	const theme = useTheme();
	const ref = useRef<HTMLDivElement>(null);

	const { selectedChatId, open, openChatPanel, closeChatPanel } = useMessengerPanelContext();
	const { data: contacts } = useContacts();
	const { data: chatList } = useChats();
	const { data: user } = useProfile();

	const chat = chatList?.find((chat) => chat.id === selectedChatId);

	const contactId = chat?.contactIds?.find((id) => id !== user?.id);

	const selectedContact = _.find(contacts, { id: contactId });

	const handlers = useSwipeable({
		onSwipedLeft: () => {
			return open && theme.direction === 'rtl' && closeChatPanel();
		},
		onSwipedRight: () => {
			return open && theme.direction === 'ltr' && closeChatPanel();
		}
	});

	const handleDocumentKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (keycode(event) === 'esc') {
				closeChatPanel();
			}
		},
		[closeChatPanel]
	);

	useEffect(() => {
		return () => {
			document.removeEventListener('keydown', handleDocumentKeyDown);
		};
	}, [handleDocumentKeyDown]);

	useEffect(() => {
		if (open) {
			document.addEventListener('keydown', handleDocumentKeyDown);
		} else {
			document.removeEventListener('keydown', handleDocumentKeyDown);
		}
	}, [handleDocumentKeyDown, open]);

	/**
	 * Click Away Listener
	 */
	useEffect(() => {
		function handleDocumentClick(ev: MouseEvent) {
			if (ref.current && !ref.current.contains(ev.target as Node)) {
				closeChatPanel();
			}
		}

		if (open) {
			document.addEventListener('click', handleDocumentClick, true);
		}

		return () => {
			if (!open) {
				return;
			}

			document.removeEventListener('click', handleDocumentClick, true);
		};
	}, [open, closeChatPanel]);

	return (
		<Root
			opened={open ? 1 : 0}
			{...handlers}
		>
			<div
				className="panel flex max-w-full flex-col"
				ref={ref}
			>
				<AppBar
					position="static"
					className="shadow-md"
					color="secondary"
				>
					<Toolbar className="px-1">
						{(!open || selectedChatId === '') && (
							<div className="flex flex-1 items-center gap-3 px-0.75">
								<IconButton
									className="h-14 w-14"
									color="inherit"
									onClick={() => openChatPanel()}
									size="large"
								>
									<FuseSvgIcon size={20}>lucide:message-square-text</FuseSvgIcon>
								</IconButton>
								{selectedChatId === '' && (
									<Typography
										className="text-lg"
										color="inherit"
									>
										Team Chat
									</Typography>
								)}
							</div>
						)}
						{open && selectedContact && (
							<div className="flex flex-1 items-center px-3">
								<Avatar src={selectedContact.avatar} />
								<Typography
									className="mx-4 text-lg"
									color="inherit"
								>
									{selectedContact.name}
								</Typography>
							</div>
						)}
						<div className="flex px-1">
							<IconButton
								onClick={() => closeChatPanel()}
								color="inherit"
								size="large"
							>
								<FuseSvgIcon>lucide:x</FuseSvgIcon>
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				<Paper className="shadow-0 flex min-h-px flex-1 flex-row">
					<ContactList className="flex shrink-0" />

					{open && selectedChatId ? (
						<Chat className="z-10 flex flex-1" />
					) : (
						<div className="flex flex-1 flex-col items-center justify-center p-6">
							<FuseSvgIcon
								size={64}
								color="disabled"
							>
								lucide:message-square-text
							</FuseSvgIcon>
							<Typography
								className="mt-6 px-4 pb-6 text-center"
								color="text.secondary"
							>
								Select a contact to start a conversation.
							</Typography>
						</div>
					)}
				</Paper>
			</div>
		</Root>
	);
}

const MessengerPanelWrapper = () => {
	return (
		<MessengerPanelContextProvider>
			<MessengerPanel />
		</MessengerPanelContextProvider>
	);
};

export default MessengerPanelWrapper;
