import FuseHighlight from '@fuse/core/FuseHighlight';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Link from '@fuse/core/Link';
import FusePageCarded from '@fuse/core/FusePageCarded';

/**
 * StaffRoleExample component renders the page for staff users.
 */
function StaffRoleExampleView() {
	return (
		<FusePageCarded
			header={
				<div className="flex flex-1 items-center justify-between p-6">
					<Typography className="truncate text-3xl leading-7 font-extrabold tracking-tight sm:leading-10 md:text-4xl">
						Staff: Auth role example page
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
              import StaffRoleExample from './StaffRoleExample';

              export const StaffRoleExampleConfig = {
                  settings: {
                      layout: {
                          config: {}
                      }
                  },
                  auth    : authRoles.staff,//['admin',staff']
                  routes  : [
                      {
                          path     : '/auth/staff-role-example',
                          element:StaffRoleExample
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
                    'title': 'Nav item only for Staff',
                    'type' : 'item',
                    'auth' : authRoles.staff,//['admin','staff']
                    'url'  : '/auth/staff-role-example',
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

export default StaffRoleExampleView;
