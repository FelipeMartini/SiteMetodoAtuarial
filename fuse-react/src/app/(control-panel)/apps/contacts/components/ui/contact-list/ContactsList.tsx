import { motion } from 'motion/react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ContactListItem from './ContactListItem';
import { useFilteredContacts } from '../../../hooks/useFilteredContacts';
import { useGroupedContacts } from '../../../hooks/useGroupedContacts';
import { Contact, GroupedContacts } from '../../../api/types';
import FuseLoading from '@fuse/core/FuseLoading';

/**
 * The contacts list.
 */
function ContactsList() {
	const { data: filteredContacts, isLoading } = useFilteredContacts();
	const { data: groupedFilteredContacts, isLoading: isGroupedContactsLoading } = useGroupedContacts();

	if (isLoading || isGroupedContactsLoading) {
		return <FuseLoading />;
	}

	if (filteredContacts?.length === 0) {
		return (
			<div className="flex h-full flex-1 items-center justify-center">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no contacts!
				</Typography>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="flex max-h-full w-full flex-auto flex-col"
		>
			{Object?.entries(groupedFilteredContacts)?.map(([key, group]: [string, GroupedContacts]) => {
				return (
					<div
						key={key}
						className="relative"
					>
						<Typography
							color="text.secondary"
							className="border-divider sticky top-0 z-10 border-b-1 px-4 py-1 text-base font-semibold md:px-8"
							sx={{
								backgroundColor: 'background.paper'
							}}
						>
							{key}
						</Typography>
						<List className="m-0 w-full p-0">
							{group?.children?.map((item: Contact) => (
								<ContactListItem
									key={item.id}
									contact={item}
								/>
							))}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default ContactsList;
