import { SnackbarContent } from 'notistack';
import NotificationCard from './NotificationCard';
import { Notification } from '../../api/types';

type NotificationTemplateProps = {
	item: Notification;
	onClose: () => void;
	ref?: React.Ref<HTMLDivElement>;
};

/**
 * The notification template.
 */
function NotificationTemplate(props: NotificationTemplateProps) {
	const { item, ref } = props;

	return (
		<SnackbarContent
			ref={ref}
			className="pointer-events-auto relative mx-auto w-full max-w-80 py-1"
		>
			<NotificationCard
				item={item}
				onClose={props.onClose}
			/>
		</SnackbarContent>
	);
}

export default NotificationTemplate;
