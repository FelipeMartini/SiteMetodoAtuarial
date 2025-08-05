import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { layoutConfigOnlyMain } from '@/configs/layoutConfigTemplates';
import Error401PageView from './components/views/Error401PageView';
import Error404PageView from './components/views/Error404PageView';

/**
 * The Error page routes.
 */
const route: FuseRouteItemType = {
	path: '',
	children: [
		{
			path: '401',
			element: <Error401PageView />
		},
		{
			path: '404',
			element: <Error404PageView />,
			settings: { layout: layoutConfigOnlyMain },
			auth: null
		}
	]
};

export default route;
