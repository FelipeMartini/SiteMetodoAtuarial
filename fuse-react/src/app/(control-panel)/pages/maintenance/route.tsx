import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const MaintenancePageView = lazy(() => import('./components/views/MaintenancePageView'));

/**
 * Maintenance Page Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/maintenance',
	element: <MaintenancePageView />
};

export default Route;
