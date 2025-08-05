import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

type NotificationIconProps = {
	value?: string;
};

/**
 * The notification icon.
 */
function NotificationIcon(props: NotificationIconProps) {
	const { value } = props;

	switch (value) {
		case 'error': {
			return (
				<FuseSvgIcon
					className="mr-2 opacity-75"
					color="inherit"
					size={20}
				>
					lucide:circle-minus
				</FuseSvgIcon>
			);
		}
		case 'success': {
			return (
				<FuseSvgIcon
					className="mr-2 opacity-75"
					color="inherit"
					size={20}
				>
					lucide:circle-check
				</FuseSvgIcon>
			);
		}
		case 'warning': {
			return (
				<FuseSvgIcon
					className="mr-2 opacity-75"
					color="inherit"
					size={20}
				>
					lucide:circle-alert
				</FuseSvgIcon>
			);
		}
		case 'info': {
			return (
				<FuseSvgIcon
					className="mr-2 opacity-75"
					color="inherit"
					size={20}
				>
					lucide:info
				</FuseSvgIcon>
			);
		}
		default: {
			return null;
		}
	}
}

export default NotificationIcon;
