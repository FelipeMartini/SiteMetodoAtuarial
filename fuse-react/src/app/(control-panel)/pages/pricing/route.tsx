import { Navigate } from 'react-router';

import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import ModernPricingPageView from './components/views/ModernPricingPageView';
import SimplePricingPageView from './components/views/SimplePricingPageView';
import SinglePricingPageView from './components/views/SinglePricingPageView';
import TablePricingPageView from './components/views/TablePricingPageView';

/**
 * Pricing Pages Route
 */
const Route: FuseRouteItemType = {
	path: 'pages/pricing',
	children: [
		{
			path: '',
			element: <Navigate to="modern" />
		},
		{
			path: 'modern',
			element: <ModernPricingPageView />
		},
		{
			path: 'simple',
			element: <SimplePricingPageView />
		},
		{
			path: 'single',
			element: <SinglePricingPageView />
		},
		{
			path: 'table',
			element: <TablePricingPageView />
		}
	]
};

export default Route;
