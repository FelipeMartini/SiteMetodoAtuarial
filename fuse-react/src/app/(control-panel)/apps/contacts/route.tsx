import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';

const ContactsAppView = lazy(() => import('./components/views/ContactsAppView'));
const ContactView = lazy(() => import('./components/views/ContactView'));
const ContactForm = lazy(() => import('./components/forms/ContactForm'));

/**
 * The ContactsApp Route.
 */
const route: FuseRouteItemType = {
	path: 'apps/contacts',
	element: (
		<ContactsAppView>
			<Outlet />
		</ContactsAppView>
	),
	children: [
		{
			path: ':contactId',
			element: <ContactView />
		},
		{
			path: ':contactId/edit',
			element: <ContactForm />
		}
	]
};

export default route;
