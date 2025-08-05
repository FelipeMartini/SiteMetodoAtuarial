import { lazy } from 'react';
import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';

const ScrumboardAppView = lazy(() => import('./components/views/ScrumboardAppView'));
const BoardView = lazy(() => import('./components/views/BoardView'));
const BoardsView = lazy(() => import('./components/views/BoardsView'));

/**
 * The Scrumboard App Route
 */
const route: FuseRouteItemType = {
	path: 'apps/scrumboard',
	element: (
		<ScrumboardAppView>
			<Outlet />
		</ScrumboardAppView>
	),
	children: [
		{
			path: '',
			element: <Navigate to="/apps/scrumboard/boards" />
		},
		{
			path: 'boards',
			children: [
				{
					path: '',
					element: <BoardsView />
				},
				{
					path: ':boardId',
					element: <BoardView />
				}
			]
		}
	]
};

export default route;
