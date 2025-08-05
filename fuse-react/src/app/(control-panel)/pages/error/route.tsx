import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const Error404PageView = lazy(() => import('./components/views/Error404PageView'));
const Error500PageView = lazy(() => import('./components/views/Error500PageView'));
const Error401PageView = lazy(() => import('./components/views/Error401PageView'));

/**
 * The error pages config.
 */
const route: FuseRouteItemType = {
	path: 'pages/error',
	children: [
		{
			path: '',
			element: <Navigate to="404" />
		},
		{
			path: '401',
			element: <Error401PageView />
		},
		{
			path: '404',
			element: <Error404PageView />
		},
		{
			path: '500',
			element: <Error500PageView />
		}
	]
};

export default route;
