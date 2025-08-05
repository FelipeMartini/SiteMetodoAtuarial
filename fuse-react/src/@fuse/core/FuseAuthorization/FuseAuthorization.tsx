import React, { Component } from 'react';
import withRouter, { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import {
	getSessionRedirectUrl,
	resetSessionRedirectUrl,
	setSessionRedirectUrl
} from '@fuse/core/FuseAuthorization/sessionRedirectUrl';
import { getFuseRouteParamUtil } from '@fuse/hooks/useFuseRouteParameter';
import FuseUtils from '@fuse/utils/FuseUtils';
import { FuseRouteObjectType } from '@fuse/core/FuseLayout/FuseLayout';
import FuseLoading from '../FuseLoading';

type FuseAuthorizationProps = {
	children: React.ReactNode;
	location: Location;
	userRole: string[] | string;
	loginRedirectUrl?: string;
} & WithRouterProps;

type State = {
	accessGranted: boolean;
};

function isUserGuest(role: string[] | string) {
	return !role || (Array.isArray(role) && role?.length === 0);
}

/**
 * FuseAuthorization is a higher-order component that wraps its child component which handles the authorization logic of the app.
 * It checks the provided Auth property from FuseRouteItemType (auth property) against the current logged-in user role.
 */
class FuseAuthorization extends Component<FuseAuthorizationProps, State> {
	constructor(props: FuseAuthorizationProps) {
		super(props);

		this.state = {
			accessGranted: true
		};
	}

	componentDidMount() {
		const { accessGranted } = this.state;

		if (!accessGranted) {
			this.redirectRoute();
		}
	}

	shouldComponentUpdate(nextProps: FuseAuthorizationProps, nextState: State) {
		const { accessGranted } = this.state;

		return nextState.accessGranted !== accessGranted;
	}

	componentDidUpdate() {
		const { accessGranted } = this.state;

		if (!accessGranted) {
			this.redirectRoute();
		}
	}

	static getDerivedStateFromProps(props: FuseAuthorizationProps) {
		const { location, userRole } = props;
		const { pathname } = location;

		const auth = getFuseRouteParamUtil<FuseRouteObjectType['auth']>(pathname, 'auth', false);
		const ignoredPaths = ['/', '/callback', '/sign-in', '/sign-out', '/logout', '/404'];

		// is auth is empy array
		const isOnlyGuestAllowed = Array.isArray(auth) && auth.length === 0;
		const isGuest = isUserGuest(userRole);

		const userHasPermission = FuseUtils.hasPermission(auth, userRole);

		if (auth && !userHasPermission && !ignoredPaths.includes(pathname)) {
			setSessionRedirectUrl(pathname);
		}

		/**
		 * If user is member but don't have permission to view the route
		 * redirected to main route '/'
		 */
		if (!userHasPermission && !isGuest && !ignoredPaths.includes(pathname)) {
			if (isOnlyGuestAllowed) {
				setSessionRedirectUrl('/');
			} else {
				setSessionRedirectUrl('401');
			}
		}

		return {
			accessGranted: auth ? userHasPermission : true
		};
	}

	redirectRoute() {
		const { userRole, navigate, loginRedirectUrl = '/' } = this.props;
		const redirectUrl = getSessionRedirectUrl() || loginRedirectUrl;

		/*
		User is guest
		Redirect to Login Page
		*/
		if (isUserGuest(userRole)) {
			setTimeout(() => navigate('/sign-in'), 0);
		} else {
			/*
		  User is member
		  User must be on unAuthorized page or just logged in
		  Redirect to dashboard or loginRedirectUrl
			*/
			setTimeout(() => navigate(redirectUrl), 0);
			resetSessionRedirectUrl();
		}
	}

	render() {
		const { accessGranted } = this.state;
		const { children } = this.props;
		return accessGranted ? children : <FuseLoading />;
	}
}

const FuseAuthorizationWIthRouter = withRouter(FuseAuthorization);

export default FuseAuthorizationWIthRouter;
