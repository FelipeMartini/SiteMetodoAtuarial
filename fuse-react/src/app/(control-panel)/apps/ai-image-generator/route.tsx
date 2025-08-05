import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const AiImageGenAppView = lazy(() => import('./components/views/AiImageGenAppView'));

/**
 * The AI Image Generator app routes.
 */
const route: FuseRouteItemType = {
	path: 'apps/ai-image-generator',
	element: <AiImageGenAppView />
};

export default route;
