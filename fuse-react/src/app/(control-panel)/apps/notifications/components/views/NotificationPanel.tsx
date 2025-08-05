import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import _ from 'lodash';
import usePathname from '@fuse/hooks/usePathname';
import NotificationCard from '../ui/NotificationCard';
import { useGetAllNotifications } from '../../api/hooks/useGetAllNotifications';
import { useDeleteNotification } from '../../api/hooks/useDeleteNotification';
import { useDeleteNotifications } from '../../api/hooks/useDeleteNotifications';
import { useCreateNotification } from '../../api/hooks/useCreateNotification';
import NotificationModel from '../../api/models/NotificationModel';
import NotificationTemplate from '../ui/NotificationTemplate';
import { useNotificationPanelContext } from '../../contexts/NotificationPanelContext/useNotificationPanelContext';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
	'& .MuiDrawer-paper': {
		backgroundColor: theme.vars.palette.background.default,
		width: 320
	}
}));

/**
 * The notification panel.
 */
function NotificationPanel() {
	const pathname = usePathname();
	const { data: notifications } = useGetAllNotifications();
	const { mutate: deleteNotification } = useDeleteNotification();
	const { mutate: deleteNotifications } = useDeleteNotifications();
	const { mutate: addNotification } = useCreateNotification();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();
	const { isOpen, close, toggle } = useNotificationPanelContext();

	useEffect(() => {
		if (isOpen) {
			close();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	useEffect(() => {
		const item = NotificationModel({
			title: 'New Fuse React version is released! ',
			description: ' Checkout the release notes for more information. 🚀 ',
			link: '/documentation/changelog',
			icon: 'lucide:flame',
			variant: 'secondary'
		});

		setTimeout(() => {
			addNotification(item);

			enqueueSnackbar(item.title, {
				key: item.id,
				autoHideDuration: 6000,
				content: (
					<NotificationTemplate
						item={item}
						onClose={() => {
							closeSnackbar(item.id);
						}}
					/>
				)
			});
		}, 2000);
	}, [addNotification, closeSnackbar, enqueueSnackbar]);

	function handleClose() {
		close();
	}

	function handleDismiss(id: string) {
		deleteNotification(id);
	}

	function handleDismissAll() {
		deleteNotifications(notifications.map((notification) => notification.id));
	}

	function demoNotification() {
		const item = NotificationModel({ title: 'Great Job! this is awesome.' });

		addNotification(item);

		enqueueSnackbar(item.title, {
			key: item.id,
			content: (
				<NotificationTemplate
					item={item}
					onClose={() => {
						closeSnackbar(item.id);
					}}
				/>
			)
		});
	}

	return (
		<StyledSwipeableDrawer
			open={isOpen}
			anchor="right"
			onOpen={() => {}}
			onClose={() => toggle()}
			disableSwipeToOpen
		>
			<IconButton
				className="absolute top-0 right-0 z-999 m-1"
				onClick={handleClose}
				size="large"
			>
				<FuseSvgIcon color="action">lucide:x</FuseSvgIcon>
			</IconButton>

			<FuseScrollbars className="flex h-full flex-col p-4">
				{notifications && notifications?.length > 0 ? (
					<div className="flex flex-auto flex-col">
						<div className="mb-8 flex items-end justify-between pt-34">
							<Typography className="text-2xl leading-none font-bold">Notifications</Typography>
							<Typography
								className="text-md cursor-pointer underline"
								color="secondary"
								onClick={handleDismissAll}
							>
								dismiss all
							</Typography>
						</div>
						{_.orderBy(notifications, ['time'], ['desc']).map((item) => (
							<NotificationCard
								key={item.id}
								className="mb-4"
								item={item}
								onClose={handleDismiss}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-1 items-center justify-center p-4">
						<Typography
							className="text-center text-xl"
							color="text.secondary"
						>
							There are no notifications for now.
						</Typography>
					</div>
				)}
				<div className="flex items-center justify-center py-4">
					<Button
						size="small"
						variant="outlined"
						onClick={demoNotification}
					>
						Create a notification example
					</Button>
				</div>
			</FuseScrollbars>
		</StyledSwipeableDrawer>
	);
}

export default NotificationPanel;
