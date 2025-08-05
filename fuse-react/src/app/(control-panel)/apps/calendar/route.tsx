import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CalendarAppView = lazy(() => import('./components/views/CalendarAppView'));

/**
 * The Calendar App Route.
 */
const route: FuseRouteItemType = {
	path: 'apps/calendar',
	element: <CalendarAppView />
};

export default route;
