import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ClassicConfirmationRequiredPageView = lazy(
	() => import('./components/views/ClassicConfirmationRequiredPageView')
);
const ModernConfirmationRequiredPageView = lazy(() => import('./components/views/ModernConfirmationRequiredPageView'));
const ModernReversedConfirmationRequiredPageView = lazy(
	() => import('./components/views/ModernReversedConfirmationRequiredPageView')
);
const SplitScreenConfirmationRequiredPageView = lazy(
	() => import('./components/views/SplitScreenConfirmationRequiredPageView')
);
const SplitScreenReversedConfirmationRequiredPageView = lazy(
	() => import('./components/views/SplitScreenReversedConfirmationRequiredPageView')
);
const FullScreenConfirmationRequiredPageView = lazy(
	() => import('./components/views/FullScreenConfirmationRequiredPageView')
);
const FullScreenReversedConfirmationRequiredPageView = lazy(
	() => import('./components/views/FullScreenReversedConfirmationRequiredPageView')
);

/**
 * Confirmation Required Pages Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/authentication/confirmation-required',
	children: [
		{
			path: '',
			element: <Navigate to="classic" />
		},
		{
			path: 'classic',
			element: <ClassicConfirmationRequiredPageView />
		},
		{
			path: 'modern',
			element: <ModernConfirmationRequiredPageView />
		},
		{
			path: 'modern-reversed',
			element: <ModernReversedConfirmationRequiredPageView />
		},
		{
			path: 'split-screen',
			element: <SplitScreenConfirmationRequiredPageView />
		},
		{
			path: 'split-screen-reversed',
			element: <SplitScreenReversedConfirmationRequiredPageView />
		},
		{
			path: 'full-screen',
			element: <FullScreenConfirmationRequiredPageView />
		},
		{
			path: 'full-screen-reversed',
			element: <FullScreenReversedConfirmationRequiredPageView />
		}
	]
};

export default Route;
