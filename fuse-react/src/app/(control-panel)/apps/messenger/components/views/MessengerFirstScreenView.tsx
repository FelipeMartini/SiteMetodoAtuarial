'use client';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useMessengerAppContext } from '../../contexts/MessengerAppContext/useMessengerAppContext';

/**
 * The chat first screen.
 */
function MessengerFirstScreenView() {
	const { setMainSidebarOpen } = useMessengerAppContext();

	return (
		<div className="flex w-full flex-1 flex-col items-center justify-center p-6">
			<FuseSvgIcon
				className="mb-4"
				color="action"
				size={40}
			>
				lucide:message-square-text
			</FuseSvgIcon>
			<Typography
				className="text-secondary hidden text-xl font-medium tracking-tight lg:flex"
				color="text.secondary"
			>
				Select a conversation or start a new chat
			</Typography>
			<Button
				variant="contained"
				color="secondary"
				className="flex lg:hidden"
				onClick={() => setMainSidebarOpen(true)}
			>
				Select a conversation or start a new chat
			</Button>
		</div>
	);
}

export default MessengerFirstScreenView;
