import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const NotificationsAppView = lazy(() => import('./components/views/NotificationsAppView'));

/**
 * The Notifications App Route.
 */
const route: FuseRouteItemType = {
	path: 'apps/notifications',
	children: [
		{
			path: '',
			element: <NotificationsAppView />,
			exact: true
		}
	]
};

export default route;
