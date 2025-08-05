import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import authRoles from '@auth/authRoles';
import AdminRoleExampleView from './components/views/AdminRoleExampleView';
import GuestRoleExampleView from './components/views/GuestRoleExampleView';
import StaffRoleExampleView from './components/views/StaffRoleExampleView';

/**
 * The Auth role examples routes
 */
const route: FuseRouteItemType = {
	children: [
		{
			path: 'auth-role-examples/admin-role-example',
			element: <AdminRoleExampleView />,
			auth: authRoles.admin // ['admin']
		},
		{
			path: 'auth-role-examples/guest-role-example',
			element: <GuestRoleExampleView />,
			auth: authRoles.onlyGuest // ['guest']
		},
		{
			path: 'auth-role-examples/staff-role-example',
			element: <StaffRoleExampleView />,
			auth: authRoles.staff // ['admin','staff']
		}
	]
};

export default route;
