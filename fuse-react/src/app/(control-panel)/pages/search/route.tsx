import { Navigate } from 'react-router';
import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicSearchPageView = lazy(() => import('./components/views/ClassicSearchPageView'));
const ModernSearchPageView = lazy(() => import('./components/views/ModernSearchPageView'));

/**
 * Search Pages Route
 */
const route: FuseRouteItemType = {
	path: 'pages/search',
	children: [
		{
			path: '',
			element: <Navigate to="modern" />
		},
		{
			path: 'modern',
			element: <ModernSearchPageView />
		},
		{
			path: 'classic',
			element: <ClassicSearchPageView />
		}
	]
};

export default route;
