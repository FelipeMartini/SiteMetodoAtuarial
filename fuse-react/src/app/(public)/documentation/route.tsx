import { Navigate, Outlet } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import DocumentationLayout from './components/layout/DocumentationLayout';
import documentationLayoutSettings from './lib/constants/documentationLayoutSettings';
import documentationAuth from './lib/constants/documentationAuth';
import { lazy } from 'react';

const ChangelogDoc = lazy(() => import('./components/views/ChangelogDoc'));

const IntroductionDoc = lazy(() => import('./components/views/getting-started/IntroductionDoc'));
const InstallationDoc = lazy(() => import('./components/views/getting-started/InstallationDoc'));
const GitRepositoryDoc = lazy(() => import('./components/views/getting-started/GitRepositoryDoc'));

const DevelopmentServerDoc = lazy(() => import('./components/views/development/DevelopmentServerDoc'));
const ProductionDoc = lazy(() => import('./components/views/development/ProductionDoc'));
const DeploymentDoc = lazy(() => import('./components/views/development/DeploymentDoc'));
const DirectoryStructureDoc = lazy(() => import('./components/views/development/DirectoryStructureDoc'));
const UpdatingFuseReactDoc = lazy(() => import('./components/views/development/UpdatingFuseReactDoc'));
const IDEsDoc = lazy(() => import('./components/views/development/IDEsDoc'));

import ApiConfigurationDoc from './components/views/development/ApiConfigurationDoc';
import MultiLanguageDoc from './components/views/development/MultiLanguageDoc';

const SettingsDoc = lazy(() => import('./components/views/configuration/ConfigurationSettingsDoc'));
const RoutingDoc = lazy(() => import('./components/views/configuration/ConfigurationRoutingDoc'));
const NavigationDoc = lazy(() => import('./components/views/configuration/ConfigurationNavigationDoc'));

const ThemeShemesDoc = lazy(() => import('./components/views/user-interface/ThemeSchemesDoc'));
const ThemeLayoutsDoc = lazy(() => import('./components/views/user-interface/ThemeLayoutsDoc'));
const RTLSupportDoc = lazy(() => import('./components/views/user-interface/RTLSupportDoc'));
const ChangingDefaultFontDoc = lazy(() => import('./components/views/user-interface/ChangingDefaultFontDoc'));
const TypographyUI = lazy(() => import('./components/views/user-interface/TypographyUI'));
const TailwindCssUI = lazy(() => import('./components/views/user-interface/TailwindCssUI'));

const AuthenticationDoc = lazy(() => import('./components/views/AuthenticationDoc'));

const AuthorizationDoc = lazy(() => import('./components/views/AuthorizationDoc'));

const FuseThemeDoc = lazy(() => import('./components/views/fuse-components/FuseThemeDoc'));
const FuseLayoutDoc = lazy(() => import('./components/views/fuse-components/FuseLayoutDoc'));
const FusePageCardedDoc = lazy(() => import('./components/views/fuse-components/FusePageCardedDoc'));
const FusePageSimpleDoc = lazy(() => import('./components/views/fuse-components/FusePageSimpleDoc'));
const FuseScrollbarsDoc = lazy(() => import('./components/views/fuse-components/FuseScrollbarsDoc'));
const FuseHighlightDoc = lazy(() => import('./components/views/fuse-components/FuseHighlightDoc'));
const FuseCountdownDoc = lazy(() => import('./components/views/fuse-components/FuseCountdownDoc'));
const FuseNavigationDoc = lazy(() => import('./components/views/fuse-components/FuseNavigationDoc'));
const FuseDialogDoc = lazy(() => import('./components/views/fuse-components/FuseDialogDoc'));

const ReactHookFormDoc = lazy(() => import('./components/views/third-party-components/ReactHookFormDoc'));
const ReactGoogleMapsApiDoc = lazy(() => import('./components/views/third-party-components/ReactGoogleMapsApiDoc'));
const ReactApexchartsDoc = lazy(() => import('./components/views/third-party-components/ReactApexchartsDoc'));
import TiptapEditorDoc from './components/views/third-party-components/TiptapEditorDoc';
import MaterialUIComponentsRoutes from './MaterialUIComponentsRoutes';

import OverviewPageLayoutsUI from './components/views/user-interface/page-layouts/OverviewPageLayoutsUI';
import EmptyExampleComponent from './components/views/user-interface/page-layouts/empty/EmptyExampleComponent';
import PageLayoutOverview from './components/ui/page-layouts/PageLayoutOverview';
import overviews from './lib/constants/pageLayoutOverviews';
import CardedFullWidthNormalScrollComponent from './components/views/user-interface/page-layouts/carded/CardedFullWidthNormalScrollComponent';
import CardedFullWidthPageScrollComponent from './components/views/user-interface/page-layouts/carded/CardedFullWidthPageScrollComponent';
import CardedFullWidthContentScrollComponent from './components/views/user-interface/page-layouts/carded/CardedFullWidthContentScrollComponent';
import CardedWithSidebarsNormalScrollComponent from './components/views/user-interface/page-layouts/carded/CardedWithSidebarsNormalScrollComponent';
import CardedWithSidebarsPageScrollComponent from './components/views/user-interface/page-layouts/carded/CardedWithSidebarsPageScrollComponent';
import CardedWithSidebarsContentScrollComponent from './components/views/user-interface/page-layouts/carded/CardedWithSidebarsContentScrollComponent';
import SimpleFullWidthNormalScrollComponent from './components/views/user-interface/page-layouts/simple/SimpleFullWidthNormalScrollComponent';
import SimpleFullWidthPageScrollComponent from './components/views/user-interface/page-layouts/simple/SimpleFullWidthPageScrollComponent';
import SimpleFullWidthContentScrollComponent from './components/views/user-interface/page-layouts/simple/SimpleFullWidthContentScrollComponent';
import SimpleWithSidebarsNormalScrollComponent from './components/views/user-interface/page-layouts/simple/SimpleWithSidebarsNormalScrollComponent';
import SimpleWithSidebarsPageScrollComponent from './components/views/user-interface/page-layouts/simple/SimpleWithSidebarsPageScrollComponent';
import SimpleWithSidebarsContentScrollComponent from './components/views/user-interface/page-layouts/simple/SimpleWithSidebarsContentScrollComponent';
import IconListPage from './components/ui/user-interface/icons/IconListPage';

/**
 * Documentation Route
 */
const route: FuseRouteItemType = {
	path: 'documentation',
	element: (
		<DocumentationLayout>
			<Outlet />
		</DocumentationLayout>
	),
	settings: documentationLayoutSettings,
	auth: documentationAuth,
	children: [
		{
			path: '',
			element: <Navigate to="getting-started/introduction" />
		},
		{
			path: 'changelog',
			children: [
				{
					path: '',
					element: <ChangelogDoc />
				}
			]
		},
		{
			path: 'getting-started',
			children: [
				{
					path: '',
					element: <Navigate to="introduction" />
				},
				{
					path: 'introduction',
					element: <IntroductionDoc />
				},
				{
					path: 'installation',
					element: <InstallationDoc />
				},
				{
					path: 'git-repository',
					element: <GitRepositoryDoc />
				}
			]
		},
		{
			path: 'development',
			children: [
				{
					path: '',
					element: <Navigate to="development-server" />
				},
				{
					path: 'development-server',
					element: <DevelopmentServerDoc />
				},
				{
					path: 'production',
					element: <ProductionDoc />
				},
				{
					path: 'deployment',
					element: <DeploymentDoc />
				},
				{
					path: 'directory-structure',
					element: <DirectoryStructureDoc />
				},
				{
					path: 'api-integration',
					children: [
						{
							path: '',
							element: <Navigate to="api-configuration" />
						},
						{
							path: 'api-configuration',
							element: <ApiConfigurationDoc />
						}
					]
				},
				{
					path: 'multi-language',
					element: <MultiLanguageDoc />
				},
				{
					path: 'updating-fuse-react',
					element: <UpdatingFuseReactDoc />
				},
				{
					path: 'ides-vscode-webstorm',
					element: <IDEsDoc />
				}
			]
		},
		{
			path: 'configuration',
			children: [
				{
					path: '',
					element: <Navigate to="settings" />
				},
				{
					path: 'settings',
					element: <SettingsDoc />
				},
				{
					path: 'routing',
					element: <RoutingDoc />
				},
				{
					path: 'navigation',
					element: <NavigationDoc />
				}
			]
		},
		{
			path: 'user-interface',
			children: [
				{
					path: '',
					element: <Navigate to="theme-schemes" />
				},
				{
					path: 'theme-schemes',
					element: <ThemeShemesDoc />
				},
				{
					path: 'theme-layouts',
					element: <ThemeLayoutsDoc />
				},
				{
					path: 'rtl-support',
					element: <RTLSupportDoc />
				},
				{
					path: 'changing-default-font',
					element: <ChangingDefaultFontDoc />
				},
				{
					path: 'typography',
					element: <TypographyUI />
				},
				{
					path: 'tailwindcss',
					element: <TailwindCssUI />
				},
				{
					path: 'page-layouts',
					children: [
						{
							path: '',
							element: <Navigate to="overview" />
						},
						{
							path: 'overview',
							element: <OverviewPageLayoutsUI />
						},
						{
							path: 'empty',
							element: <EmptyExampleComponent />
						},
						{
							path: 'carded',
							children: [
								{
									path: 'full-width',
									children: [
										{
											path: '',
											element: <Navigate to="overview" />
										},
										{
											path: 'overview',
											element: <PageLayoutOverview layoutOptions={overviews.carded.fullWidth} />
										},
										{
											path: 'normal-scroll',
											element: <CardedFullWidthNormalScrollComponent />
										},
										{
											path: 'page-scroll',
											element: <CardedFullWidthPageScrollComponent />
										},
										{
											path: 'content-scroll',
											element: <CardedFullWidthContentScrollComponent />
										}
									]
								},
								{
									path: 'with-sidebars',
									children: [
										{
											path: '',
											element: <Navigate to="overview" />
										},
										{
											path: 'overview',
											element: (
												<PageLayoutOverview layoutOptions={overviews.carded.withSidebars} />
											)
										},
										{
											path: 'normal-scroll',
											element: <CardedWithSidebarsNormalScrollComponent />
										},
										{
											path: 'page-scroll',
											element: <CardedWithSidebarsPageScrollComponent />
										},
										{
											path: 'content-scroll',
											element: <CardedWithSidebarsContentScrollComponent />
										}
									]
								}
							]
						},
						{
							path: 'simple',
							children: [
								{
									path: 'full-width',
									children: [
										{
											path: '',
											element: <Navigate to="overview" />
										},
										{
											path: 'overview',
											element: <PageLayoutOverview layoutOptions={overviews.simple.fullWidth} />
										},
										{
											path: 'normal-scroll',
											element: <SimpleFullWidthNormalScrollComponent />
										},
										{
											path: 'page-scroll',
											element: <SimpleFullWidthPageScrollComponent />
										},
										{
											path: 'content-scroll',
											element: <SimpleFullWidthContentScrollComponent />
										}
									]
								},
								{
									path: 'with-sidebars',
									children: [
										{
											path: '',
											element: <Navigate to="overview" />
										},
										{
											path: 'overview',
											element: (
												<PageLayoutOverview layoutOptions={overviews.simple.withSidebars} />
											)
										},
										{
											path: 'normal-scroll',
											element: <SimpleWithSidebarsNormalScrollComponent />
										},
										{
											path: 'page-scroll',
											element: <SimpleWithSidebarsPageScrollComponent />
										},
										{
											path: 'content-scroll',
											element: <SimpleWithSidebarsContentScrollComponent />
										}
									]
								}
							]
						}
					]
				},
				{
					path: 'icons',
					children: [
						{
							path: '',
							element: <Navigate to="heroicons" />
						},
						{
							path: 'lucide',
							element: (
								<IconListPage
									pageTitle="Lucide"
									referenceUrl="https://lucide.dev/"
									iconSet="lucide"
									apiUrl="mock/ui-icons/lucide"
								/>
							)
						},
						{
							path: 'heroicons',
							children: [
								{
									path: '',
									element: <Navigate to="outline" />
								},
								{
									path: 'outline',
									element: (
										<IconListPage
											pageTitle="Heroicons Outline"
											referenceUrl="https://heroicons.com/"
											iconSet="heroicons-outline"
											apiUrl="mock/ui-icons/heroicons"
										/>
									)
								},
								{
									path: 'solid',
									element: (
										<IconListPage
											pageTitle="Heroicons Solid"
											referenceUrl="https://heroicons.com/"
											iconSet="heroicons-solid"
											apiUrl="mock/ui-icons/heroicons"
										/>
									)
								}
							]
						},
						{
							path: 'material',
							children: [
								{
									path: '',
									element: <Navigate to="outline" />
								},
								{
									path: 'outline',
									element: (
										<IconListPage
											pageTitle="Material Outline"
											iconSet="material-outline"
											apiUrl="mock/ui-icons/material"
										/>
									)
								},
								{
									path: 'solid',
									element: (
										<IconListPage
											pageTitle="Material Solid"
											iconSet="material-solid"
											apiUrl="mock/ui-icons/material"
										/>
									)
								},
								{
									path: 'twotone',
									element: (
										<IconListPage
											pageTitle="Material Twotone"
											iconSet="material-twotone"
											apiUrl="mock/ui-icons/material"
										/>
									)
								}
							]
						},
						{
							path: 'feather',
							element: (
								<IconListPage
									pageTitle="Feather"
									iconSet="feather"
									apiUrl="mock/ui-icons/feather"
								/>
							)
						}
					]
				}
			]
		},
		{
			path: 'authentication',
			children: [
				{
					path: '',
					element: <AuthenticationDoc />
				}
			]
		},
		{
			path: 'authorization',
			children: [
				{
					path: '',
					element: <AuthorizationDoc />
				}
			]
		},
		{
			path: 'fuse-components',
			children: [
				{
					path: '',
					element: <Navigate to="fuse-theme" />
				},
				{
					path: 'fuse-theme',
					element: <FuseThemeDoc />
				},
				{
					path: 'fuse-layout',
					element: <FuseLayoutDoc />
				},
				{
					path: 'fuse-page-carded',
					element: <FusePageCardedDoc />
				},
				{
					path: 'fuse-page-simple',
					element: <FusePageSimpleDoc />
				},
				{
					path: 'fuse-scrollbars',
					element: <FuseScrollbarsDoc />
				},
				{
					path: 'fuse-highlight',
					element: <FuseHighlightDoc />
				},
				{
					path: 'fuse-countdown',
					element: <FuseCountdownDoc />
				},
				{
					path: 'fuse-navigation',
					element: <FuseNavigationDoc />
				},
				{
					path: 'fuse-dialog',
					element: <FuseDialogDoc />
				}
			]
		},
		{
			path: 'third-party-components',
			children: [
				{
					path: '',
					element: <Navigate to="react-hook-form" />
				},
				{
					path: 'react-hook-form',
					element: <ReactHookFormDoc />
				},
				{
					path: 'react-google-maps-api',
					element: <ReactGoogleMapsApiDoc />
				},
				{
					path: 'react-apexcharts',
					element: <ReactApexchartsDoc />
				},
				{
					path: 'tiptap-editor',
					element: <TiptapEditorDoc />
				}
			]
		},
		{
			path: 'material-ui-components',
			children: MaterialUIComponentsRoutes
		}
	]
};

export default route;
