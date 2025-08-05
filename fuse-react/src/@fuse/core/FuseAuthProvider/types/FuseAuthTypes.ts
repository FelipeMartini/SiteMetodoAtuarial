import React from 'react';
import { PartialDeep } from 'type-fest/source/partial-deep';
import { FuseAuthUser } from './FuseAuthUser';

export type FuseAuthProviderMethods = {
	signOut: () => void;
	updateUser: (U: PartialDeep<FuseAuthUser>) => Promise<Response>;
};

export type FuseAuthProviderComponentProps = React.PropsWithChildren<{
	onAuthStateChanged?: (T: FuseAuthProviderState) => void;
}> &
	React.RefAttributes<FuseAuthProviderMethods>;

export type FuseAuthProviderComponentType = React.ForwardRefExoticComponent<FuseAuthProviderComponentProps>;

export type FuseAuthProviderState<T = Record<string, unknown>> = {
	authStatus: 'configuring' | 'authenticated' | 'unauthenticated';
	isAuthenticated: boolean;
	user: FuseAuthUser<T> | null;
};

export type FuseAuthProviderType = {
	name: string;
	Provider:
		| React.ComponentType<FuseAuthProviderComponentProps>
		| React.ForwardRefExoticComponent<FuseAuthProviderComponentProps>;
};
