import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
import FusePageCarded from '@fuse/core/FusePageCarded';

/**
 * GuestRoleExample component renders the page for guest users.
 */
function GuestRoleExampleView() {
	return (
		<FusePageCarded
			header={
				<div className="flex items-center p-6">
					<Typography className="truncate text-3xl leading-7 font-extrabold tracking-tight sm:leading-10 md:text-4xl">
						Guest: Auth role example page
					</Typography>
				</div>
			}
			content={
				<div className="p-6">
					<Typography className="mb-6">
						You can see this page because you have not logged in. Otherwise you should be redirected to root
						page.
					</Typography>

					<Typography className="mb-6">This is the page's config file:</Typography>

					<FuseHighlight
						component="pre"
						className="language-js"
					>
						{`
					import {authRoles} from 'auth';
					import GuestRoleExample from './StaffRoleExampleView';

					export const GuestRoleExampleConfig = {
						settings: {
							layout: {
								config: {}
							}
						},
						auth    : authRoles.onlyGuest,//['guest']
						routes  : [
							{
								path     : '/auth/guest-role-example',
								element: <GuestRoleExample/>
							}
						]
					};
					`}
					</FuseHighlight>

					<Typography className="my-6">
						You can also hide the navigation item/collapse/group with user roles by giving auth property.
					</Typography>

					<FuseHighlight
						component="pre"
						className="language-json"
					>
						{`
						export const fuseNavigationConfig = [
						{
								'id'   : 'only-staff-navigation-item',
								'title': 'Nav item only for Guest',
								'type' : 'item',
								'auth' : authRoles.onlyGuest,//['guest']
								'url'  : '/auth/guest-role-example',
								'icon' : 'verified_user'
							}
						];
					`}
					</FuseHighlight>
				</div>
			}
		/>
	);
}

export default GuestRoleExampleView;
