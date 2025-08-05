import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicSignInPageView = lazy(() => import('./components/views/ClassicSignInPageView'));
const ModernSignInPageView = lazy(() => import('./components/views/ModernSignInPageView'));
const ModernReversedSignInPageView = lazy(() => import('./components/views/ModernReversedSignInPageView'));
const SplitScreenSignInPageView = lazy(() => import('./components/views/SplitScreenSignInPageView'));
const SplitScreenReversedSignInPageView = lazy(() => import('./components/views/SplitScreenReversedSignInPageView'));
const FullScreenSignInPageView = lazy(() => import('./components/views/FullScreenSignInPageView'));
const FullScreenReversedSignInPageView = lazy(() => import('./components/views/FullScreenReversedSignInPageView'));

/**
 * SignIn Pages Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/authentication/sign-in',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicSignInPageView />
		},
		{
			path: 'modern',
			element: <ModernSignInPageView />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedSignInPageView />
		},
		{
			path: 'split-screen',
			element: <SplitScreenSignInPageView />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedSignInPageView />
		},
		{
			path: 'full-screen',
			element: <FullScreenSignInPageView />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedSignInPageView />
		}
	]
};

export default Route;
