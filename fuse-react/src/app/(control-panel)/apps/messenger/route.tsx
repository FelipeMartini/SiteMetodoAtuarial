import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import MessengerChatView from './components/views/MessengerChatView';
import MessengerFirstScreenView from './components/views/MessengerFirstScreenView';
import { Outlet } from 'react-router';

const MessengerAppView = lazy(() => import('./components/views/MessengerAppView'));

/**
 * Messenger App Route
 */
const route: FuseRouteItemType = {
	path: 'apps/messenger',
	element: (
		<MessengerAppView>
			<Outlet />
		</MessengerAppView>
	),
	children: [
		{
			path: '',
			element: <MessengerFirstScreenView />
		},
		{
			path: ':chatId',
			element: <MessengerChatView />
		}
	]
};

export default route;
