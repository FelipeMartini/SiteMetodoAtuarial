import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { lazy } from 'react';

const ActivitiesPageView = lazy(() => import('./components/views/ActivitiesPageView'));

/**
 * The Activities Page Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/activities',
	element: <ActivitiesPageView />
};

export default Route;
