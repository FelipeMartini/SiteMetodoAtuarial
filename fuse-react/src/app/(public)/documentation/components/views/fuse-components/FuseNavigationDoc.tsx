import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * FuseNavigation Doc
 * This document provides information on how to use the FuseNavigation.
 */
function FuseNavigationDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				FuseNavigation
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FuseNavigation</code> is a custom-built Fuse component that allows you to create a multi-level
				collapsable navigation.
			</Typography>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				[navigation]
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FuseNavigation</code> uses an array to populate the entire navigation. It supports four different
				navigation items; Group, Collapse, Item. and Divider. These items can be mixed and matched to create
				unique and complex navigation layouts.
			</Typography>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				[layout]
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				"vertical" or "horizontal" layout options.
			</Typography>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				[active]
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				You can set <b>active</b> to "square" to use square active item style instead of rounded/circle for{' '}
				<b>vertical layout</b>.
			</Typography>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				[dense]
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				You can use <b>{`dense={true}`}</b> to set dense variation of the navigation.
			</Typography>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				[checkPermission]
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				You can use <b>{`checkPermission={true}`}</b> to enable authorization for navigation.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Usage
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{`<FuseNavigation navigation={navigation} layout="vertical" active="square" dense={true}/>`}
			</FuseHighlight>

			<Typography
				className="mt-12 mb-2"
				variant="h4"
			>
				Navigation item types
			</Typography>

			<Typography className="mt-8 mb-2 rounded-sm border-1 border-yellow-700 bg-yellow-100 p-2 text-black">
				It is mandatory to give a unique id to all of your navigation items.
			</Typography>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				Group
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-json"
			>
				{`
              {
                id: 'apps',
                title: 'Applications',
                subtitle: 'Custom made application designs',
                type: 'group',
                icon: 'lucide:house',
                children: [
                  {
                    id: 'apps.academy',
                    title: 'Academy',
                    type: 'item',
                    icon: 'lucide:graduation-cap',
                    url: '/apps/academy',
                  }
                ]
            }
        `}
			</FuseHighlight>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				Collapse
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-json"
			>
				{`
            {
                id: 'apps.ecommerce',
                title: 'ECommerce',
                type: 'collapse',
                icon: 'lucide:shopping-cart',
                children: [
                  {
                    id: 'e-commerce-products',
                    title: 'Products',
                    type: 'item',
                    url: 'apps/e-commerce/products',
                    end: true,
                  },
              ]
            }
      `}
			</FuseHighlight>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				Item
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-json"
			>
				{`
          {
              id: 'dashboards.project',
              title: 'Project',
              type: 'item',
              icon: 'lucide:clipboard-check',
              url: '/dashboards/project',
            }
        `}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2 text-2xl font-medium"
				component="h2"
			>
				end: bool
			</Typography>
			<Typography
				className="mb-2 text-lg"
				component="h2"
			>
				When true, the active class/style will only be applied if the location is exactly matched.
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-json"
			>
				{`
          {
              id: 'dashboards.project',
              title: 'Project',
              type: 'item',
              icon: 'lucide:clipboard-check',
              url: '/dashboards/project',
              end: true
          }
                                `}
			</FuseHighlight>
			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				Link
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-json"
			>
				{`
            {
                'id'    : 'test-link',
                'title' : 'Test Link',
                'type'  : 'link',
                'icon'  : 'link',
                'url'   : 'http://fusetheme.com',
                'target': '_blank'
            }
        `}
			</FuseHighlight>
			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				Divider
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-json"
			>
				{`
          {
              'id'   : 'project',
              'title': 'Project',
              'type' : 'item',
              'url'  : '/apps/dashboards/project'
          }
          {
              'type': 'divider
          },
          {
              'id'   : 'project',
              'title': 'Project',
              'type' : 'item',
              'url'  : '/apps/dashboards/project'
          }
          `}
			</FuseHighlight>

			<Typography
				className="mt-12 mb-2"
				variant="h4"
			>
				Actions
			</Typography>

			<Typography
				className="mb-2 text-lg"
				component="h2"
			>
				Use <code>setNavigation(navigation{'<Array>'})</code> action to set/change whole navigation.
			</Typography>

			<div className="my-4 rounded-xl border-1 p-4">
				<Typography
					className="mb-6 text-lg"
					component="h2"
				>
					With the button below, whole navigation will be changed.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-jsx mt-6"
				>
					{`
          const {setNavigation} = useNavigation();

          <Button
            onClick={() => {
              setNavigation([
                {
                  id: 'dashboards',
                  title: 'Dashboards',
                  subtitle: 'Unique dashboard designs',
                  type: 'group',
                    icon: 'lucide:house',
                    children: [
                      {
                        id: 'dashboards.project',
                        title: 'Project',
                        type: 'item',
                        icon: 'lucide:clipboard-check',
                        url: '/dashboards/project',
                      },
                      {
                        id: 'dashboards.analytics',
                        title: 'Analytics',
                        type: 'item',
                        icon: 'lucide:chart-pie',
                        url: '/dashboards/analytics',
                      },
                    ],
                  },
                  {
                    id: 'auth',
                    title: 'Auth',
                    type: 'group',
                    icon: 'verified_user',
                    children: [
                      {
                        id: 'sign-out',
                        title: 'Sign out',
                        type: 'item',
                        url: 'sign-out',
                        icon: 'exit_to_app',
                      },
                    ],
                  },
                ])
            }}
            variant="contained"
            color="secondary"
          >
            Set Navigation
          </Button>
        `}
				</FuseHighlight>
			</div>

			<Typography
				className="mb-2 text-lg"
				component="h2"
			>
				Use <code>resetNavigation()</code> action to reset navigation to initial state.
			</Typography>

			<div className="my-4 rounded-xl border-1 p-4">
				<Typography
					className="mb-6 text-lg"
					component="h2"
				>
					With the button below, navigation is returned to config defaults.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-jsx mt-6"
				>
					{`
            const {resetNavigation} = useNavigation();

            <Button
                onClick={()=> {
                    resetNavigation();
                }}
                variant="contained"
                color="secondary"
            >
                Reset Navigation
            </Button>
            `}
				</FuseHighlight>
			</div>

			<Typography
				className="mb-2 text-lg"
				component="h2"
			>
				Use
				<code>
					updateNavigationItem(id, <i>object</i>)
				</code>
				action to update a navigation item.
			</Typography>

			<div className="my-4 rounded-xl border-1 p-4">
				<Typography
					className="mb-6 text-lg"
					component="h2"
				>
					With clicking the button below, a badge will be added into the 'Project' dashboard navigation item.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-jsx mt-6"
				>
					{`
          const {updateNavigationItem} = useNavigation();
          
          <Button
            onClick={() => {
                updateNavigationItem('dashboards.project', {
                  badge: {
                    title: 'NEW'
                    }
                })
            }}
            variant="contained"
            color="secondary"
          >
              Update Navigation Item
            </Button>
        `}
				</FuseHighlight>
			</div>

			<Typography
				className="mb-2 text-lg"
				component="h2"
			>
				Use <code>removeNavigationItem(id)</code> action to remove a navigation item.
			</Typography>

			<div className="my-4 rounded-xl border-1 p-4">
				<Typography
					className="mb-6 text-lg"
					component="h2"
				>
					With the button below, "Calendar" navigation item is removed.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-jsx mt-6"
				>
					{`
            const {removeNavigationItem} = useNavigation();

            <Button
                  onClick={()=> {
                      removeNavigationItem('apps.calendar')
                  }}
                  variant="contained"
                  color="secondary"
            >
            Remove Navigation Item
            </Button>
      `}
				</FuseHighlight>
			</div>

			<Typography
				className="mb-2 text-lg"
				component="h2"
			>
				Use
				<code>
					prependNavigationItem(<i>object</i>, <i>collapseId/groupId</i>?)
				</code>
				action to prepend a navigation item into the navigation array.
			</Typography>

			<div className="my-4 rounded-xl border-1 p-4">
				<Typography
					className="mb-6 text-lg"
					component="h2"
				>
					With the button below, "fusetheme.com" navigation item is added at the top of the navigation array.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-jsx mt-6"
				>
					{`
            const {prependNavigationItem} = useNavigation();

            <Button
                onClick={()=> {
                    prependNavigationItem(
                        {
                            'id'    : 'test-link',
                            'title' : 'fusetheme.com',
                            'type'  : 'link',
                            'icon'  : 'link',
                            'url'   : 'http://fusetheme.com',
                            'target': '_blank'
                        }
                    )
                }}
                variant="contained"
                color="secondary"
            >
                Prepend Navigation Item
            </Button>
            `}
				</FuseHighlight>
			</div>

			<div className="my-4 rounded-xl border-1 p-4">
				<Typography
					className="mb-6 text-lg"
					component="h2"
				>
					With the button below, "fusetheme.com" navigation item is added into the top of the "Dashboards"
					children.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-jsx mt-6"
				>
					{`
          const {prependNavigationItem} = useNavigation();

          <Button
              onClick={()=> {
                  prependNavigationItem(
                      {
                          'id'    : 'test-link',
                          'title' : 'fusetheme.com',
                          'type'  : 'link',
                          'icon'  : 'link',
                          'url'   : 'http://fusetheme.com',
                          'target': '_blank'
                      }, 'dashboards'
                  )
              }}
              variant="contained"
              color="secondary"
          >
              Prepend Navigation Item
          </Button>
          `}
				</FuseHighlight>
			</div>

			<Typography
				className="mb-2 text-lg"
				component="h2"
			>
				Use
				<code>
					appendNavigationItem(<i>object</i>, <i>collapseId/groupId</i>?)
				</code>
				action to append a navigation item into the navigation array.
			</Typography>

			<div className="my-4 rounded-xl border-1 p-4">
				<Typography
					className="mb-6 text-lg"
					component="h2"
				>
					With the button below, "fusetheme.com" navigation item is added at the bottom of the array.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-jsx mt-6"
				>
					{`
          const {appendNavigationItem} = useNavigation();

          <Button
                onClick={()=> {
                    appendNavigationItem(
                        {
                            'id'    : 'test-link',
                            'title' : 'fusetheme.com',
                            'type'  : 'link',
                            'icon'  : 'link',
                            'url'   : 'http://fusetheme.com',
                            'target': '_blank'
                        }
                    )
                }}
                variant="contained"
                color="secondary"
            >
                Append Navigation Item
            </Button>
            `}
				</FuseHighlight>
			</div>

			<div className="my-4 rounded-xl border-1 p-4">
				<Typography
					className="mb-6 text-lg"
					component="h2"
				>
					With the button below, "fusetheme.com" navigation item is added into the bottom of the "Dashboards"
					children.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-jsx mt-6"
				>
					{`
          const {appendNavigationItem} = useNavigation();

          <Button
              onClick={()=> {
                  appendNavigationItem(
                      {
                          'id'    : 'test-link',
                          'title' : 'fusetheme.com',
                          'type'  : 'link',
                          'icon'  : 'link',
                          'url'   : 'http://fusetheme.com',
                          'target': '_blank'
                      }, 'dashboards'
                  )
              }}
              variant="contained"
              color="secondary"
          >
              Append Navigation Item
          </Button>
          `}
				</FuseHighlight>
			</div>
		</>
	);
}

export default FuseNavigationDoc;
