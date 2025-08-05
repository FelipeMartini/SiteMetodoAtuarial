import { matchRoutes, RouteMatch } from 'react-router';
import { useEffect, useState, useCallback } from 'react';
import _ from 'lodash';
import { FuseRouteObjectType } from '@fuse/core/FuseLayout/FuseLayout';
import routes from 'src/configs/routesConfig';
import usePathname from '@fuse/hooks/usePathname';

export type FuseRouteMatchType = RouteMatch & {
	route: FuseRouteObjectType;
};

/**
 * Utility function to retrieve and merge or replace a specific route parameter from matched routes.
 *
 * @param pathname The current pathname
 * @param key The key of the parameter to merge or replace (e.g., 'settings', 'auth')
 * @param useMerge Whether to merge the parameter (using lodash merge) or replace it
 * @returns The merged or replaced parameter data of type T
 */
export function getFuseRouteParamUtil<T>(pathname: string, key: keyof FuseRouteObjectType, useMerge = true): T {
	const matchedRoutes = matchRoutes(routes, pathname) as FuseRouteMatchType[] | null;

	return matchedRoutes
		? matchedRoutes.reduce((acc, match) => {
				const routeParam = match.route[key] as T;

				if (routeParam !== undefined) {
					if (useMerge) {
						if (routeParam === null) {
							acc = routeParam;
						} else {
							acc = _.merge(acc || {}, routeParam);
						}
					} else {
						acc = routeParam;
					}
				}

				return acc;
			}, {} as T)
		: ({} as T);
}

/**
 * Custom hook to retrieve and merge a specific route parameter (e.g., 'settings', 'auth') from matched routes.
 *
 * @param key The key of the parameter to merge (e.g., 'settings', 'auth')
 * @returns The merged parameter data of type T
 */
function useFuseRouteParameter<T>(key: keyof FuseRouteObjectType, useMerge = true): T {
	const pathname = usePathname();

	const getParameter = useCallback(() => {
		return getFuseRouteParamUtil<T>(pathname, key, useMerge);
	}, [key, pathname, useMerge]);

	const [parameter, setParameter] = useState<T>(() => getParameter());

	const updateParameter = useCallback(() => {
		const param = getParameter();

		if (!_.isEqual(parameter, param)) {
			setParameter(param);
		}
	}, [getParameter, parameter]);

	useEffect(() => {
		updateParameter();
	}, [updateParameter]);

	return parameter;
}

export default useFuseRouteParameter;
