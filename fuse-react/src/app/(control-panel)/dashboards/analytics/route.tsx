import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const AnalyticsDashboardAppView = lazy(() => import('./components/views/AnalyticsDashboardAppView'));

/**
 * The Analytics Dashboard App Route
 */
const route: FuseRouteItemType = {
	path: 'dashboards/analytics',
	element: <AnalyticsDashboardAppView />
};

export default route;
