import i18next from 'i18next';
import { Navigate, Outlet } from 'react-router';
import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import ar from './i18n/ar';
import en from './i18n/en';
import tr from './i18n/tr';
import MailboxMailsView from '@/app/(control-panel)/apps/mailbox/components/views/MailboxMailsView';

const MailboxAppView = lazy(() => import('./components/views/MailboxAppView'));

i18next.addResourceBundle('en', 'mailboxApp', en);
i18next.addResourceBundle('tr', 'mailboxApp', tr);
i18next.addResourceBundle('ar', 'mailboxApp', ar);

/**
 * The Mailbox App Route
 */
const Route: FuseRouteItemType = {
	path: '/apps/mailbox',
	element: (
		<MailboxAppView>
			<Outlet />
		</MailboxAppView>
	),
	children: [
		{
			path: '',
			element: <Navigate to="/apps/mailbox/folders/inbox" />
		},
		{
			path: ':category/:subCategory',
			element: <MailboxMailsView />,
			children: [{ path: '' }, { path: ':mailId' }]
		}
	]
};

export default Route;
