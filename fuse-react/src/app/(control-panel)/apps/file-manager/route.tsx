import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';

const FileManagerAppView = lazy(() => import('./components/views/FileManagerAppView'));
const FileManagerListView = lazy(() => import('./components/views/FileManagerListView'));

/**
 * The File Manager App Route.
 */
const route: FuseRouteItemType = {
	path: 'apps/file-manager',
	element: (
		<FileManagerAppView>
			<Outlet />
		</FileManagerAppView>
	),
	children: [
		{
			element: <FileManagerListView />,
			path: ''
		},
		{
			element: <FileManagerListView />,
			path: ':folderId'
		}
	]
};

export default route;
