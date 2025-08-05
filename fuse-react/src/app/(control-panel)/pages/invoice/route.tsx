import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import CompactInvoicePageView from './components/views/CompactInvoicePageView';
import ModernInvoicePageView from './components/views/ModernInvoicePageView';

/**
 * Invoice Pages Route
 */
const route: FuseRouteItemType = {
	path: 'pages/invoice',
	children: [
		{
			path: '',
			element: <Navigate to="compact" />
		},
		{
			path: 'compact',
			element: <CompactInvoicePageView />
		},
		{
			path: 'modern',
			element: <ModernInvoicePageView />
		}
	]
};

export default route;
