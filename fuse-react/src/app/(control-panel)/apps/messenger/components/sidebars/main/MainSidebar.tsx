import FuseUtils from '@fuse/utils';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import ContactListItem from './ContactListItem';
import UserAvatar from '../../ui/UserAvatar';
import MainSidebarMoreMenu from './MainSidebarMoreMenu';
import ChatListItem from './ChatListItem';
import { useProfile } from '../../../api/hooks/profile/useProfile';
import { useContacts } from '../../../api/hooks/contacts/useContacts';
import { useChats } from '../../../api/hooks/chats/useChats';
import { useMessengerAppContext } from '../../../contexts/MessengerAppContext/useMessengerAppContext';

/**
 * The main sidebar.
 */
function MainSidebar() {
	const { setUserSidebarOpen } = useMessengerAppContext();
	const { data: contacts } = useContacts();
	const { data: user } = useProfile();
	const { data: chatList } = useChats();

	const [searchText, setSearchText] = useState('');

	function handleSearchText(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchText(event.target.value);
	}

	return (
		<div className="flex flex-auto flex-col">
			<Box
				className="sticky top-0 z-10 flex shrink-0 flex-col px-4 py-2 md:px-6"
				sx={(theme) => ({
					backgroundColor: theme.palette.background.default
				})}
			>
				<div className="mb-4 flex items-center justify-between">
					{user && (
						<div
							className="flex cursor-pointer items-center"
							onClick={() => setUserSidebarOpen(true)}
							onKeyDown={() => setUserSidebarOpen(true)}
							role="button"
							tabIndex={0}
						>
							<UserAvatar
								className="relative"
								user={user}
							/>
							<Typography className="mx-4 font-medium">{user?.name}</Typography>
						</div>
					)}
					<MainSidebarMoreMenu className="-mx-4" />
				</div>
				{useMemo(
					() => (
						<Paper className="flex h-9 w-full items-center gap-2 rounded-lg border-1 p-1 px-2 py-1 shadow-none">
							<FuseSvgIcon color="action">lucide:search</FuseSvgIcon>
							<Input
								placeholder="Search or start new chat"
								className="flex flex-1"
								disableUnderline
								fullWidth
								value={searchText}
								slotProps={{
									input: {
										'aria-label': 'Search'
									}
								}}
								onChange={handleSearchText}
							/>
						</Paper>
					),
					[searchText]
				)}
			</Box>
			<div className="flex-auto">
				<List className="w-full">
					{useMemo(() => {
						if (!contacts || !chatList) {
							return null;
						}

						function getFilteredArray<T>(arr: T[], _searchText: string): T[] {
							if (_searchText.length === 0) {
								return arr;
							}

							return FuseUtils.filterArrayByString(arr, _searchText);
						}

						const filteredContacts = getFilteredArray([...contacts], searchText);

						const filteredChatList = chatList.filter((chat) =>
							filteredContacts.some((contact) => chat.contactIds.includes(contact.id))
						);

						const container = {
							show: {
								transition: {
									staggerChildren: 0.02
								}
							}
						};

						const item = {
							hidden: { opacity: 0, y: 10 },
							show: { opacity: 1, y: 0 }
						};

						return (
							<motion.div
								className="flex shrink-0 flex-col"
								variants={container}
								initial="hidden"
								animate="show"
							>
								{filteredChatList.length > 0 && (
									<motion.div variants={item}>
										<Typography
											className="px-4 pt-4 text-2xl font-medium md:px-6"
											color="secondary.main"
										>
											Chats
										</Typography>
									</motion.div>
								)}

								{filteredChatList.map((chat) => (
									<motion.div
										variants={item}
										key={chat.id}
									>
										<ChatListItem item={chat} />
									</motion.div>
								))}

								{filteredContacts.length > 0 && (
									<motion.div variants={item}>
										<Typography
											className="px-4 pt-4 text-2xl font-medium md:px-6"
											color="secondary.main"
										>
											Contacts
										</Typography>
									</motion.div>
								)}

								{filteredContacts.map((contact) => (
									<motion.div
										variants={item}
										key={contact.id}
									>
										<ContactListItem item={contact} />
									</motion.div>
								))}
							</motion.div>
						);
					}, [contacts, chatList, searchText])}
				</List>
			</div>
		</div>
	);
}

export default MainSidebar;
