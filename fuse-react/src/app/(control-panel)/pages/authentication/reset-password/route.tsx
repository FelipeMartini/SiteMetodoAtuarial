import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicResetPasswordPageView = lazy(() => import('./components/views/ClassicResetPasswordPageView'));
const ModernResetPasswordPageView = lazy(() => import('./components/views/ModernResetPasswordPageView'));
const ModernReversedResetPasswordPageView = lazy(
	() => import('./components/views/ModernReversedResetPasswordPageView')
);
const SplitScreenResetPasswordPageView = lazy(() => import('./components/views/SplitScreenResetPasswordPageView'));
const SplitScreenReversedResetPasswordPageView = lazy(
	() => import('./components/views/SplitScreenReversedResetPasswordPageView')
);
const FullScreenResetPasswordPageView = lazy(() => import('./components/views/FullScreenResetPasswordPageView'));
const FullScreenReversedResetPasswordPageView = lazy(
	() => import('./components/views/FullScreenReversedResetPasswordPageView')
);

/**
 * Reset Password Pages Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/authentication/reset-password',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicResetPasswordPageView />
		},
		{
			path: 'modern',
			element: <ModernResetPasswordPageView />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedResetPasswordPageView />
		},
		{
			path: 'split-screen',
			element: <SplitScreenResetPasswordPageView />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedResetPasswordPageView />
		},
		{
			path: 'full-screen',
			element: <FullScreenResetPasswordPageView />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedResetPasswordPageView />
		}
	]
};

export default Route;
