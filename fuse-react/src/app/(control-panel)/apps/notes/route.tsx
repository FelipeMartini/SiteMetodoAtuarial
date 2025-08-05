import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Navigate, Outlet } from 'react-router';

const NotesAppView = lazy(() => import('./components/views/NotesAppView'));
const NoteListView = lazy(() => import('./components/views/NoteListView'));

/**
 * The Notes App Route
 */
const Route: FuseRouteItemType = {
	path: 'apps/notes',
	children: [
		{
			path: '',
			element: <Navigate to="all" />
		},
		{
			path: ':filter',
			element: (
				<NotesAppView>
					<Outlet />
				</NotesAppView>
			),
			children: [
				{
					path: '',
					element: <NoteListView />
				},
				{
					path: ':id',
					element: <NoteListView />
				}
			]
		}
	]
};

export default Route;
