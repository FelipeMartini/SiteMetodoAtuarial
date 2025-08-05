import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSnackbar } from 'notistack';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import { useCreateNotification } from '../../api/hooks/useCreateNotification';
import { useDeleteNotifications } from '../../api/hooks/useDeleteNotifications';
import { useGetAllNotifications } from '../../api/hooks/useGetAllNotifications';
import NotificationModel from '../../api/models/NotificationModel';
import NotificationTemplate from './NotificationTemplate';

/**
 * The Notifications app header.
 */
function NotificationsAppHeader() {
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const { data: notifications } = useGetAllNotifications();

	const { mutate: addNotification } = useCreateNotification();
	const { mutate: deleteNotifications } = useDeleteNotifications();

	function handleDismissAll() {
		deleteNotifications(notifications.map((notification) => notification.id));
	}

	function demoNotification() {
		const item = NotificationModel({ title: 'Great Job! this is awesome.' });

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

		addNotification(item);
	}

	return (
		<div className="container flex w-full">
			<div className="flex min-w-0 flex-auto flex-col p-4 pb-0 sm:flex-row sm:items-center md:p-6">
				<div className="flex flex-auto flex-col">
					<PageBreadcrumb className="mb-2" />

					<Typography className="mb-1 text-3xl leading-none font-extrabold tracking-tight">
						Notifications
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Lists all notifications
					</Typography>
				</div>
				<div className="mt-3 flex items-center gap-2 sm:mx-2 sm:mt-0">
					<Button
						className="whitespace-nowrap"
						onClick={demoNotification}
						variant="contained"
						color="primary"
					>
						Example notification
					</Button>

					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						onClick={handleDismissAll}
						startIcon={<FuseSvgIcon>lucide:bell</FuseSvgIcon>}
					>
						Dissmiss All
					</Button>
				</div>
			</div>
		</div>
	);
}

export default NotificationsAppHeader;
