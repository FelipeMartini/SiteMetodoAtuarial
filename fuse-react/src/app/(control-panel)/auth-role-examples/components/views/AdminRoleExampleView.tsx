import FuseHighlight from '@fuse/core/FuseHighlight';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Link from '@fuse/core/Link';

/**
 * AdminRoleExample component renders the page for admin users.
 */
function AdminRoleExampleView() {
	return (
		<FusePageCarded
			header={
				<div className="flex flex-1 items-center justify-between p-6">
					<Typography className="truncate text-3xl leading-7 font-extrabold tracking-tight sm:leading-10 md:text-4xl">
						Admin: Auth role example page
					</Typography>
					<Button
						component={Link}
						variant="contained"
						color="secondary"
						to="/sign-out"
						startIcon={<FuseSvgIcon>lucide:square-arrow-right</FuseSvgIcon>}
					>
						Sign out
					</Button>
				</div>
			}
			content={
				<div className="p-6">
					<Typography className="mb-6">
						You can see this page because you have logged in and have permission. Otherwise you should be
						redirected to login page.
					</Typography>

					<Typography className="mb-6">This is the page's config file:</Typography>

					<FuseHighlight
						component="pre"
						className="language-js"
					>
						{`
              import {authRoles} from 'auth';
              import AdminRoleExample from './AdminRoleExampleView';

              export const AdminRoleExampleConfig = {
                  settings: {
                      layout: {
                          config: {}
                      }
                  },
                  auth    : authRoles.admin,//['admin']
                  routes  : [
                      {
                          path     : '/auth/admin-role-example',
                          element: <AdminRoleExample/>
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
                    'id'   : 'only-admin-navigation-item',
                    'title': 'Nav item only for Admin',
                    'type' : 'item',
                    'auth' : authRoles.admin,//['admin']
                    'url'  : '/auth/admin-role-example',
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

export default AdminRoleExampleView;
