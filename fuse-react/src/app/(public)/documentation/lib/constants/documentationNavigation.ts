import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';
import fuseComponentsNavigation from './fuseComponentsNavigation';
import materialUIComponentsNavigation from './materialUIComponentsNavigation';
import thirdPartyComponentsNavigation from './thirdPartyComponentsNavigation';
import fuseReactLatestVersion from './fuseReactLatestVersion';

/**
 * Documentation Navigation
 */
const documentationNavigation: FuseNavItemType = {
	id: 'documentation',
	title: 'Documentation',
	subtitle: 'Everything you need to know about Fuse',
	icon: 'lucide:book-open',
	type: 'group',
	children: [
		{
			id: 'changelog',
			title: 'Changelog',
			type: 'item',
			icon: 'lucide:megaphone',
			url: '/documentation/changelog',
			badge: {
				title: fuseReactLatestVersion,
				bg: 'rgb(236, 12, 142)',
				fg: '#FFFFFF'
			}
		},
		{
			id: 'getting-started',
			title: 'Getting Started',
			type: 'group',
			icon: 'play_arrow',
			children: [
				{
					id: 'introduction-doc',
					title: 'Introduction',
					type: 'item',
					icon: 'lucide:play',
					url: '/documentation/getting-started/introduction'
				},
				{
					id: 'git-repository-doc',
					title: 'Git Repository',
					type: 'item',
					icon: 'lucide:folder-open',
					url: '/documentation/getting-started/git-repository'
				}
			]
		},
		{
			id: 'development-guide',
			title: 'Development Guide',
			type: 'group',
			icon: 'developer_board',
			children: [
				{
					id: 'installation-doc',
					title: 'Installation',
					type: 'item',
					icon: 'lucide:cog',
					url: '/documentation/getting-started/installation'
				},
				{
					id: 'development-server-doc',
					title: 'Development Server',
					type: 'item',
					icon: 'lucide:server',
					url: '/documentation/development/development-server'
				},
				{
					id: 'production-doc',
					title: 'Production Build',
					type: 'item',
					icon: 'lucide:zap',
					url: '/documentation/development/production'
				},
				{
					id: 'deployment-doc',
					title: 'Deployment',
					type: 'item',
					icon: 'lucide:send',
					url: '/documentation/development/deployment'
				},
				{
					id: 'directory-structure-doc',
					title: 'Directory Structure',
					type: 'item',
					icon: 'lucide:folder',
					url: '/documentation/development/directory-structure'
				},
				{
					id: 'api-integration-doc',
					title: 'API Integration',
					type: 'collapse',
					icon: 'lucide:cloud',
					url: '/documentation/development/api-integration',
					children: [
						{
							id: 'api-configuration-doc',
							title: 'API Configuration',
							type: 'item',
							url: '/documentation/development/api-integration/api-configuration'
						},
						{
							id: 'mock-api-doc',
							title: 'Mock API Documentation',
							type: 'item',
							url: '/documentation/development/api-integration/mock-api'
						}
					]
				},
				{
					id: 'fuse-react-multi-language-doc',
					title: 'Localization (Multi-Language)',
					type: 'item',
					icon: 'lucide:globe',
					url: '/documentation/development/multi-language'
				},
				{
					id: 'updating-fuse-react-doc',
					title: 'Updating Guide',
					type: 'item',
					icon: 'lucide:chevrons-up',
					url: '/documentation/development/updating-fuse-react'
				},
				{
					id: 'fuse-react-ides-vscode-webstorm-doc',
					title: 'IDE Configuration',
					type: 'item',
					icon: 'lucide:code-xml',
					url: '/documentation/development/ides-vscode-webstorm'
				}
			]
		},
		{
			id: 'configuration',
			title: 'Configuration',
			type: 'group',
			icon: 'settings',
			children: [
				{
					id: 'default-settings-doc',
					title: 'Default Settings',
					type: 'item',
					icon: 'lucide:settings-2',
					url: '/documentation/configuration/settings'
				},
				{
					id: 'fuse-react-routing-doc',
					title: 'Routing',
					type: 'item',
					icon: 'lucide:map',
					url: '/documentation/configuration/routing'
				},
				{
					id: 'fuse-react-navigation-doc',
					title: 'Navigation',
					type: 'item',
					icon: 'lucide:square-menu',
					url: '/documentation/configuration/navigation'
				}
			]
		},
		{
			id: 'user-interface',
			title: 'User Interface',
			type: 'group',
			icon: 'palette',
			children: [
				{
					id: 'theme-schemes-doc',
					title: 'Theme Schemes',
					type: 'item',
					icon: 'lucide:swatch-book',
					url: '/documentation/user-interface/theme-schemes'
				},
				{
					id: 'theme-layouts-doc',
					title: 'Theme Layouts',
					type: 'item',
					icon: 'lucide:layers',
					url: '/documentation/user-interface/theme-layouts'
				},
				{
					id: 'user-interface.page-layouts',
					title: 'Page Layouts',
					type: 'collapse',
					icon: 'lucide:layout-grid',
					children: [
						{
							id: 'user-interface.page-layouts.overview',
							title: 'Overview',
							type: 'item',
							url: '/documentation/user-interface/page-layouts/overview'
						},
						{
							id: 'user-interface.page-layouts.carded',
							title: 'Carded',
							type: 'collapse',
							children: [
								{
									id: 'user-interface.page-layouts.carded.full-width',
									title: 'Full Width',
									type: 'collapse',
									url: '/documentation/user-interface/page-layouts/carded/full-width',
									children: [
										{
											id: 'user-interface.page-layouts.carded.full-width.overview',
											title: 'Full Width Overview',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/carded/full-width/overview'
										},
										{
											id: 'user-interface.page-layouts.carded.full-width.normal-scroll',
											title: 'Full Width Normal Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/carded/full-width/normal-scroll'
										},
										{
											id: 'user-interface.page-layouts.carded.full-width.page-scroll',
											title: 'Full Width Page Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/carded/full-width/page-scroll'
										},
										{
											id: 'user-interface.page-layouts.carded.full-width.content-scroll',
											title: 'Full Width Content Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/carded/full-width/content-scroll'
										}
									]
								},
								{
									id: 'user-interface.page-layouts.carded.with-sidebars',
									title: 'With Sidebars',
									type: 'collapse',
									url: '/documentation/user-interface/page-layouts/carded/with-sidebars',
									children: [
										{
											id: 'user-interface.page-layouts.carded.with-sidebars.overview',
											title: 'With Sidebars Overview',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/carded/with-sidebars/overview'
										},
										{
											id: 'user-interface.page-layouts.carded.with-sidebars.normal-scroll',
											title: 'With Sidebars Normal Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/carded/with-sidebars/normal-scroll'
										},
										{
											id: 'user-interface.page-layouts.carded.with-sidebars.page-scroll',
											title: 'With Sidebars Page Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/carded/with-sidebars/page-scroll'
										},
										{
											id: 'user-interface.page-layouts.carded.with-sidebars.content-scroll',
											title: 'With Sidebars Content Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/carded/with-sidebars/content-scroll'
										}
									]
								}
							]
						},
						{
							id: 'user-interface.page-layouts.simple',
							title: 'Simple',
							type: 'collapse',
							children: [
								{
									id: 'user-interface.page-layouts.simple.full-width',
									title: 'Full Width',
									type: 'collapse',
									url: '/documentation/user-interface/page-layouts/simple/full-width',
									children: [
										{
											id: 'user-interface.page-layouts.simple.full-width.overview',
											title: 'Full Width Overview',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/simple/full-width/overview'
										},
										{
											id: 'user-interface.page-layouts.simple.full-width.normal-scroll',
											title: 'Full Width Normal Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/simple/full-width/normal-scroll'
										},
										{
											id: 'user-interface.page-layouts.simple.full-width.page-scroll',
											title: 'Full Width Page Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/simple/full-width/page-scroll'
										},
										{
											id: 'user-interface.page-layouts.simple.full-width.content-scroll',
											title: 'Full Width Content Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/simple/full-width/content-scroll'
										}
									]
								},
								{
									id: 'user-interface.page-layouts.simple.with-sidebars',
									title: 'With Sidebars',
									type: 'collapse',
									url: '/documentation/user-interface/page-layouts/simple/with-sidebars',
									children: [
										{
											id: 'user-interface.page-layouts.simple.with-sidebars.overview',
											title: 'With Sidebars Overview',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/simple/with-sidebars/overview'
										},
										{
											id: 'user-interface.page-layouts.simple.with-sidebars.normal-scroll',
											title: 'With Sidebars Normal Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/simple/with-sidebars/normal-scroll'
										},
										{
											id: 'user-interface.page-layouts.simple.with-sidebars.page-scroll',
											title: 'With Sidebars Page Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/simple/with-sidebars/page-scroll'
										},
										{
											id: 'user-interface.page-layouts.simple.with-sidebars.content-scroll',
											title: 'With Sidebars Content Scroll',
											type: 'item',
											url: '/documentation/user-interface/page-layouts/simple/with-sidebars/content-scroll'
										}
									]
								}
							]
						},
						{
							id: 'user-interface.page-layouts.empty',
							title: 'Empty Page',
							type: 'item',
							url: '/documentation/user-interface/page-layouts/empty'
						}
					]
				},
				{
					id: 'user-interface.icons',
					title: 'Icons',
					type: 'collapse',
					icon: 'lucide:sparkles',
					url: '/documentation/user-interface/icons',
					children: [
						{
							id: 'user-interface.icons.lucide',
							title: 'Lucide',
							type: 'item',
							url: '/documentation/user-interface/icons/lucide'
						},
						{
							id: 'user-interface.icons.heroicons-outline',
							title: 'Heroicons Outline',
							type: 'item',
							url: '/documentation/user-interface/icons/heroicons/outline'
						},
						{
							id: 'user-interface.icons.heroicons-solid',
							title: 'Heroicons Solid',
							type: 'item',
							url: '/documentation/user-interface/icons/heroicons/solid'
						},
						{
							id: 'user-interface.icons.material-twotone',
							title: 'Material Twotone',
							type: 'item',
							url: '/documentation/user-interface/icons/material/twotone'
						},
						{
							id: 'user-interface.icons.material-outline',
							title: 'Material Outline',
							type: 'item',
							url: '/documentation/user-interface/icons/material/outline'
						},
						{
							id: 'user-interface.icons.material-solid',
							title: 'Material Solid',
							type: 'item',
							url: '/documentation/user-interface/icons/material/solid'
						},
						{
							id: 'user-interface.icons.feather',
							title: 'Feather',
							type: 'item',
							url: '/documentation/user-interface/icons/feather'
						}
					]
				},
				{
					id: 'user-interface.tailwindcss',
					title: 'TailwindCSS',
					type: 'item',
					icon: 'lucide:wind',
					url: '/documentation/user-interface/tailwindcss'
				},
				{
					id: 'user-interface.typography',
					title: 'Typography',
					type: 'item',
					icon: 'lucide:pencil',
					url: '/documentation/user-interface/typography'
				},
				{
					id: 'changing-default-font-doc',
					title: 'Changing Default Font',
					type: 'item',
					icon: 'lucide:italic',
					url: '/documentation/user-interface/changing-default-font'
				},
				{
					id: 'rtl-doc',
					title: 'RTL Support',
					type: 'item',
					icon: 'lucide:languages',
					url: '/documentation/user-interface/rtl-support'
				}
			]
		},

		{
			id: 'authentication-authorization',
			title: 'Authentication & Authorization',
			subtitle: 'User roles and permissions',
			type: 'group',
			icon: 'lucide:layers',
			children: [
				{
					id: 'authentication',
					title: 'Authentication',
					type: 'item',
					icon: 'lucide:shield-check',
					url: '/documentation/authentication'
				},
				{
					id: 'authorization',
					title: 'Authorization',
					type: 'item',
					icon: 'lucide:shield-alert',
					url: '/documentation/authorization'
				}
			]
		},
		{
			id: 'components',
			title: 'Components',
			type: 'group',
			icon: 'lucide:component',
			children: [fuseComponentsNavigation, materialUIComponentsNavigation, thirdPartyComponentsNavigation]
		}
	]
};

export default documentationNavigation;
