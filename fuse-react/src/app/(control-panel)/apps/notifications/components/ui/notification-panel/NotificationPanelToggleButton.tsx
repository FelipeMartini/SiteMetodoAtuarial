import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { useTheme } from '@mui/material';
import { useGetAllNotifications } from '../../../api/hooks/useGetAllNotifications';
import { useNotificationPanelContext } from '../../../contexts/NotificationPanelContext/useNotificationPanelContext';

type NotificationPanelToggleButtonProps = {
	className?: string;
	children?: ReactNode;
};

/**
 * The notification panel toggle button.
 */

function NotificationPanelToggleButton(props: NotificationPanelToggleButtonProps) {
	const { className = '', children = <FuseSvgIcon>lucide:bell</FuseSvgIcon> } = props;
	const { toggle } = useNotificationPanelContext();

	const { data: notifications } = useGetAllNotifications();
	const [animate, setAnimate] = useState(false);
	const prevNotificationCount = useRef(notifications?.length);
	const theme = useTheme();
	const controls = useAnimation();

	useEffect(() => {
		if (animate) {
			controls.start({
				rotate: [0, 20, -20, 0],
				color: [theme.vars.palette.secondary.main],
				transition: { duration: 0.2, repeat: 5 }
			});
		} else {
			controls.start({
				rotate: 0,
				scale: 1,
				color: theme.vars.palette.action.active
			});
		}
	}, [animate, controls, theme.vars.palette.secondary.main, theme.vars.palette.action.active]);

	useEffect(() => {
		if (notifications?.length > prevNotificationCount.current) {
			setAnimate(true);
			const timer = setTimeout(() => setAnimate(false), 1000);
			return () => clearTimeout(timer);
		}

		prevNotificationCount.current = notifications?.length;
		return undefined;
	}, [notifications?.length]);

	return (
		<IconButton
			onClick={() => toggle()}
			className={className}
		>
			<Badge
				color="secondary"
				variant="dot"
				invisible={notifications?.length === 0}
			>
				<motion.div animate={controls}>{children}</motion.div>
			</Badge>
		</IconButton>
	);
}

export default NotificationPanelToggleButton;
