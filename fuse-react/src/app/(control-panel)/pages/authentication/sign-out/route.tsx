import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicSignOutPageView = lazy(() => import('./components/views/ClassicSignOutPageView'));
const ModernSignOutPageView = lazy(() => import('./components/views/ModernSignOutPageView'));
const ModernReversedSignOutPageView = lazy(() => import('./components/views/ModernReversedSignOutPageView'));
const SplitScreenSignOutPageView = lazy(() => import('./components/views/SplitScreenSignOutPageView'));
const SplitScreenReversedSignOutPageView = lazy(() => import('./components/views/SplitScreenReversedSignOutPageView'));
const FullScreenSignOutPageView = lazy(() => import('./components/views/FullScreenSignOutPageView'));
const FullScreenReversedSignOutPageView = lazy(() => import('./components/views/FullScreenReversedSignOutPageView'));

/**
 * SignOut Pages Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/authentication/sign-out',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicSignOutPageView />
		},
		{
			path: 'modern',
			element: <ModernSignOutPageView />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedSignOutPageView />
		},
		{
			path: 'split-screen',
			element: <SplitScreenSignOutPageView />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedSignOutPageView />
		},
		{
			path: 'full-screen',
			element: <FullScreenSignOutPageView />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedSignOutPageView />
		}
	]
};

export default Route;
