import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ProjectDashboardAppView = lazy(() => import('./components/views/ProjectDashboardAppView'));

/**
 * Project Dashboard App  Route
 */
const route: FuseRouteItemType = {
	path: 'dashboards/project',
	element: <ProjectDashboardAppView />
};

export default route;
