import authRoles from '@auth/authRoles';

const authProtectedNavigationExamples = [
	{
		id: 'sign-in',
		title: 'Sign in (only for guest)',
		type: 'item',
		url: '/sign-in',
		auth: authRoles.onlyGuest,
		icon: 'lock'
	},
	{
		id: 'register',
		title: 'Register (only for guest)',
		type: 'item',
		url: '/register',
		auth: authRoles.onlyGuest,
		icon: 'person_add'
	},
	{
		id: 'sign-out',
		title: 'Sign out (only for user)',
		type: 'item',
		auth: authRoles.user,
		url: '/sign-out',
		icon: 'exit_to_app'
	},
	{
		id: 'only-admin-navigation-item',
		title: 'Nav item only for Admin (only for admin)',
		type: 'item',
		auth: authRoles.admin,
		url: '/auth/admin-role-example',
		icon: 'verified_user'
	},
	{
		id: 'only-staff-navigation-item',
		title: 'Nav item only for Staff (only for staff)',
		type: 'item',
		auth: authRoles.staff,
		url: '/auth/staff-role-example',
		icon: 'verified_user'
	},
	{
		id: 'only-guest-navigation-item',
		title: 'Nav item only for Guest (only for guest)',
		type: 'item',
		auth: authRoles.onlyGuest,
		url: '/auth/guest-role-example',
		icon: 'verified_user'
	}
];

export default authProtectedNavigationExamples;
