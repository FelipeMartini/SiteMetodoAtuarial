import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ProfileAppView = lazy(() => import('./components/view/ProfileAppView'));

/**
 * The Profile App Route.
 */
const Route: FuseRouteItemType = {
	path: 'apps/profile',
	element: <ProfileAppView />
};

export default Route;
