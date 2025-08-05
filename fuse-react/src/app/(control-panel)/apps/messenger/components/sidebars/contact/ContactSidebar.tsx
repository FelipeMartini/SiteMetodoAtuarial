import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns/format';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import UserAvatar from '../../ui/UserAvatar';
import { useContact } from '../../../api/hooks/contacts/useContact';
import { useMessengerAppContext } from '../../../contexts/MessengerAppContext/useMessengerAppContext';
import Paper from '@mui/material/Paper';

/**
 * The contact sidebar.
 */
function ContactSidebar() {
	const { contactSidebarOpen, setContactSidebarOpen } = useMessengerAppContext();

	const contactId = contactSidebarOpen;

	const { data: contact } = useContact(contactId);

	if (!contact) {
		return null;
	}

	return (
		<Paper className="flex h-full flex-auto flex-col border-l-1">
			<Box
				className="border-b-1"
				sx={(theme) => ({
					backgroundColor: lighten(theme.palette.background.default, 0.02),
					...theme.applyStyles('light', {
						backgroundColor: lighten(theme.palette.background.default, 0.4)
					})
				})}
			>
				<Toolbar className="flex items-center px-1">
					<IconButton
						onClick={() => setContactSidebarOpen(null)}
						color="inherit"
					>
						<FuseSvgIcon>lucide:x</FuseSvgIcon>
					</IconButton>
					<Typography
						className="px-1 text-lg font-medium"
						color="inherit"
						variant="subtitle1"
					>
						Contact info
					</Typography>
				</Toolbar>
			</Box>
			<div className="mt-8 flex flex-col items-center justify-center">
				<UserAvatar
					className="text-16 h-40 w-40"
					user={contact}
				/>
				<Typography className="mt-4 text-lg font-medium">{contact.name}</Typography>
				<Typography
					color="text.secondary"
					className="text-md mt-0.5"
				>
					{contact.about}
				</Typography>
			</div>
			<div className="w-full p-6">
				{contact.attachments?.media && (
					<>
						<Typography className="mt-4 text-lg font-medium">Media</Typography>
						<div className="mt-4 grid grid-cols-4 gap-1">
							{contact.attachments?.media.map((url, index) => (
								<img
									key={index}
									className="h-20 rounded-sm object-cover"
									src={url}
									alt=""
								/>
							))}
						</div>
					</>
				)}

				<Typography className="mt-10 text-lg font-medium">Details</Typography>

				<div className="mt-4">
					<Typography
						className="text-base font-medium"
						color="text.secondary"
					>
						Emails
					</Typography>

					{contact.details.emails?.map((item, index) => (
						<div
							className="flex items-center"
							key={index}
						>
							<Typography>{item.email}</Typography>
							{item.label && (
								<Typography
									className="text-md truncate"
									color="text.secondary"
								>
									<span className="mx-2">&bull;</span>
									<span className="font-medium">{item.label}</span>
								</Typography>
							)}
						</div>
					))}
				</div>

				<div className="mt-4">
					<Typography
						className="text-base font-medium"
						color="text.secondary"
					>
						Phone numbers
					</Typography>

					{contact.details.phoneNumbers?.map((item, index) => (
						<div
							className="flex items-center"
							key={index}
						>
							<Typography>{item.phoneNumber}</Typography>
							{item.label && (
								<Typography
									className="text-md truncate"
									color="text.secondary"
								>
									<span className="mx-2">&bull;</span>
									<span className="font-medium">{item.label}</span>
								</Typography>
							)}
						</div>
					))}
				</div>

				<div className="mt-4">
					<Typography
						className="text-base font-medium"
						color="text.secondary"
					>
						Title
					</Typography>

					<Typography>{contact.details.title}</Typography>
				</div>

				<div className="mt-4">
					<Typography
						className="text-base font-medium"
						color="text.secondary"
					>
						Company
					</Typography>

					<Typography>{contact.details.company}</Typography>
				</div>

				<div className="mt-4">
					<Typography
						className="text-base font-medium"
						color="text.secondary"
					>
						Birthday
					</Typography>

					<Typography>{format(new Date(contact.details.birthday), 'P')}</Typography>
				</div>

				<div className="mt-4">
					<Typography
						className="text-base font-medium"
						color="text.secondary"
					>
						Address
					</Typography>

					<Typography>{contact.details.address}</Typography>
				</div>
			</div>
		</Paper>
	);
}

export default ContactSidebar;
