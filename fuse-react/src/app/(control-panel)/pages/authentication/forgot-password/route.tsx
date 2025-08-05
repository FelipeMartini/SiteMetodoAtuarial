import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicForgotPasswordPageView = lazy(() => import('./components/views/ClassicForgotPasswordPageView'));
const ModernForgotPasswordPageView = lazy(() => import('./components/views/ModernForgotPasswordPageView'));
const ModernReversedForgotPasswordPageView = lazy(
	() => import('./components/views/ModernReversedForgotPasswordPageView')
);
const SplitScreenForgotPasswordPageView = lazy(() => import('./components/views/SplitScreenForgotPasswordPageView'));
const SplitScreenReversedForgotPasswordPageView = lazy(
	() => import('./components/views/SplitScreenReversedForgotPasswordPageView')
);
const FullScreenForgotPasswordPageView = lazy(() => import('./components/views/FullScreenForgotPasswordPageView'));
const FullScreenReversedForgotPasswordPageView = lazy(
	() => import('./components/views/FullScreenReversedForgotPasswordPageView')
);

/**
 * Forgot Password Pages Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/authentication/forgot-password',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicForgotPasswordPageView />
		},
		{
			path: 'modern',
			element: <ModernForgotPasswordPageView />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedForgotPasswordPageView />
		},
		{
			path: 'split-screen',
			element: <SplitScreenForgotPasswordPageView />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedForgotPasswordPageView />
		},
		{
			path: 'full-screen',
			element: <FullScreenForgotPasswordPageView />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedForgotPasswordPageView />
		}
	]
};

export default Route;
