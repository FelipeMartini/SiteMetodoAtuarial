import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicComingSoonPageView = lazy(() => import('./components/views/ClassicComingSoonPageView'));
const ModernComingSoonPageView = lazy(() => import('./components/views/ModernComingSoonPageView'));
const ModernReversedComingSoonPageView = lazy(() => import('./components/views/ModernReversedComingSoonPageView'));
const SplitScreenComingSoonPageView = lazy(() => import('./components/views/SplitScreenComingSoonPageView'));
const SplitScreenReversedComingSoonPageView = lazy(
	() => import('./components/views/SplitScreenReversedComingSoonPageView')
);
const FullScreenComingSoonPageView = lazy(() => import('./components/views/FullScreenComingSoonPageView'));
const FullScreenReversedComingSoonPageView = lazy(
	() => import('./components/views/FullScreenReversedComingSoonPageView')
);

/**
 * ComingSoon Pages Route
 */
const route: FuseRouteItemType = {
	path: 'pages/coming-soon',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicComingSoonPageView />
		},
		{
			path: 'modern',
			element: <ModernComingSoonPageView />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedComingSoonPageView />
		},
		{
			path: 'split-screen',
			element: <SplitScreenComingSoonPageView />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedComingSoonPageView />
		},
		{
			path: 'full-screen',
			element: <FullScreenComingSoonPageView />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedComingSoonPageView />
		}
	]
};

export default route;
