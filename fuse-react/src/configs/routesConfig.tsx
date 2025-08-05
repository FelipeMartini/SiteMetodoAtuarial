// Dynamically import all *Route.tsx files from the app folder
import { FuseRouteConfigType, FuseRoutesType } from '@fuse/utils/FuseUtils';
import { Navigate } from 'react-router';
import FuseLoading from '@fuse/core/FuseLoading';
import ErrorBoundary from '@fuse/utils/ErrorBoundary';
import { layoutConfigOnlyMain } from './layoutConfigTemplates';
import settingsConfig from './settingsConfig';
import App from '@/app/App';

const namedRouteConfigModules: Record<string, unknown> = import.meta.glob('/src/app/**/*Route.tsx', {
	eager: true
});

const routeConfigModules: Record<string, unknown> = import.meta.glob('/src/app/**/route.tsx', {
	eager: true
});

const allConfigModules = { ...namedRouteConfigModules, ...routeConfigModules };

const mainRoutes: FuseRouteConfigType[] = Object.keys(allConfigModules)
	.map((modulePath) => {
		const moduleConfigs = (allConfigModules[modulePath] as { default: FuseRouteConfigType | FuseRouteConfigType[] })
			.default;
		return Array.isArray(moduleConfigs) ? moduleConfigs : [moduleConfigs];
	})
	.flat();

const routes: FuseRoutesType = [
	{
		path: '/',
		element: <App />,
		auth: settingsConfig.defaultAuth,
		errorElement: <ErrorBoundary />,
		children: [
			{
				path: '/',
				element: <Navigate to="/dashboards/project" />
			},
			...mainRoutes,
			{
				path: 'loading',
				element: <FuseLoading />,
				settings: { layout: layoutConfigOnlyMain }
			}
		]
	},
	{
		path: '*',
		element: <Navigate to="/404" />
	}
];

export default routes;
