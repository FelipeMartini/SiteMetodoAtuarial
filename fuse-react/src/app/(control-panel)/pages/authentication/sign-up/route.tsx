import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicSignUpPageView = lazy(() => import('./components/views/ClassicSignUpPageView'));
const ModernSignUpPageView = lazy(() => import('./components/views/ModernSignUpPageView'));
const ModernReversedSignUpPageView = lazy(() => import('./components/views/ModernReversedSignUpPageView'));
const SplitScreenSignUpPageView = lazy(() => import('./components/views/SplitScreenSignUpPageView'));
const SplitScreenReversedSignUpPageView = lazy(() => import('./components/views/SplitScreenReversedSignUpPageView'));
const FullScreenSignUpPageView = lazy(() => import('./components/views/FullScreenSignUpPageView'));
const FullScreenReversedSignUpPageView = lazy(() => import('./components/views/FullScreenReversedSignUpPageView'));

/**
 * SignUp Pages Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/authentication/sign-up',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicSignUpPageView />
		},
		{
			path: 'modern',
			element: <ModernSignUpPageView />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedSignUpPageView />
		},
		{
			path: 'split-screen',
			element: <SplitScreenSignUpPageView />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedSignUpPageView />
		},
		{
			path: 'full-screen',
			element: <FullScreenSignUpPageView />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedSignUpPageView />
		}
	]
};

export default Route;
