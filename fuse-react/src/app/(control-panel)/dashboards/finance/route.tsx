import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const FinanceDashboardAppView = lazy(() => import('./components/views/FinanceDashboardAppView'));

/**
 * Finance Dashboard App Route
 */
const route: FuseRouteItemType = {
	path: 'dashboards/finance',
	element: <FinanceDashboardAppView />
};

export default route;
