import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const CryptoDashboardAppView = lazy(() => import('./components/views/CryptoDashboardAppView'));

/**
 * Crypto Dashboard App Route
 */
const route: FuseRouteItemType = {
	path: 'dashboards/crypto',
	element: <CryptoDashboardAppView />
};

export default route;
