import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicUnlockSessionPageView = lazy(() => import('./components/views/ClassicUnlockSessionPageView'));
const ModernUnlockSessionPageView = lazy(() => import('./components/views/ModernUnlockSessionPageView'));
const ModernReversedUnlockSessionPageView = lazy(
	() => import('./components/views/ModernReversedUnlockSessionPageView')
);
const SplitScreenUnlockSessionPageView = lazy(() => import('./components/views/SplitScreenUnlockSessionPageView'));
const SplitScreenReversedUnlockSessionPageView = lazy(
	() => import('./components/views/SplitScreenReversedUnlockSessionPageView')
);
const FullScreenUnlockSessionPageView = lazy(() => import('./components/views/FullScreenUnlockSessionPageView'));
const FullScreenReversedUnlockSessionPageView = lazy(
	() => import('./components/views/FullScreenReversedUnlockSessionPageView')
);

/**
 * UnlockSession Pages Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/authentication/unlock-session',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicUnlockSessionPageView />
		},
		{
			path: 'modern',
			element: <ModernUnlockSessionPageView />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedUnlockSessionPageView />
		},
		{
			path: 'split-screen',
			element: <SplitScreenUnlockSessionPageView />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedUnlockSessionPageView />
		},
		{
			path: 'full-screen',
			element: <FullScreenUnlockSessionPageView />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedUnlockSessionPageView />
		}
	]
};

export default Route;
