import { useEffect, useCallback, useImperativeHandle, useState, useMemo } from 'react';
import { Amplify } from 'aws-amplify';
import { User } from '@auth/user';
import { fetchUserAttributes } from '@aws-amplify/auth';
import { PartialDeep } from 'type-fest';
import { FuseAuthProviderComponentProps, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { authCreateDbUser, authGetDbUserByEmail, authUpdateDbUser } from '@auth/authApi';
import AWSAuthContext, { AWSAuthContextType } from './AWSAuthContext';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import awsAuthConfig from './awsAuthConfig';

// Configure Amplify
Amplify.configure(awsAuthConfig);

function AWSAuthProviderContent(props: FuseAuthProviderComponentProps) {
	const { children, onAuthStateChanged, ref } = props;

	const { user: _awsUser, signOut, authStatus: awsAuthStatus } = useAuthenticator();

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState>({
		authStatus: 'configuring',
		isAuthenticated: false,
		user: null
	});

	/**
	 * Watch for changes in the auth state
	 * and pass them to the FuseAuthProvider
	 */
	useEffect(() => {
		if (onAuthStateChanged) {
			onAuthStateChanged(authState);
		}
	}, [authState, onAuthStateChanged]);

	/**
	 * If awsAuthStatus is authenticated,
	 * Fetch user data from db
	 * and set the auth state
	 */
	useEffect(() => {
		async function fetchUser() {
			const userAttributes = await fetchUserAttributes();
			let userDbData: User;

			try {
				// Fetch user data from db
				const userResponse = await authGetDbUserByEmail(userAttributes.email);
				userDbData = userResponse as User;
			} catch (error) {
				console.error(error);

				// If user data does not exist in db, create a new user record
				const newUserResponse = await authCreateDbUser({
					email: userAttributes.email,
					role: ['admin'],
					displayName: userAttributes.displayName,
					photoURL: userAttributes.photoURL
				});
				userDbData = (await newUserResponse) as User;
			}

			return userDbData;
		}

		if (awsAuthStatus === 'authenticated') {
			fetchUser()
				.then((userDbData) => {
					setAuthState({
						user: userDbData,
						isAuthenticated: true,
						authStatus: 'authenticated'
					});
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				});
		} else if (awsAuthStatus !== 'configuring') {
			/**
			 * if user is not logged in, set auth state to unauthenticated
			 */
			setAuthState({
				authStatus: 'unauthenticated',
				isAuthenticated: false,
				user: null
			});
		}
	}, [awsAuthStatus]);

	/**
	 * Sign out
	 */
	const handleSignOut = useCallback(async () => {
		signOut();
	}, [signOut]);

	/**
	 * Update user
	 */
	const updateUser: AWSAuthContextType['updateUser'] = useCallback(async (_user: PartialDeep<User>) => {
		try {
			return await authUpdateDbUser(_user);
		} catch (error) {
			console.error('Error updating user:', error);
			return Promise.reject(error);
		}
	}, []);

	/**
	 * Expose methods to Fuse Auth Provider
	 */
	useImperativeHandle(ref, () => ({
		signOut: handleSignOut,
		updateUser
	}));

	/**
	 * Auth Context Value
	 */
	const authContextValue = useMemo(
		() => ({
			...authState,
			signOut: handleSignOut,
			updateUser
		}),
		[authState, handleSignOut, updateUser]
	);

	return <AWSAuthContext value={authContextValue}>{children}</AWSAuthContext>;
}

function AWSAuthProvider(props: FuseAuthProviderComponentProps) {
	const { children, onAuthStateChanged, ref } = props;

	return (
		<Authenticator.Provider>
			<AWSAuthProviderContent
				ref={ref}
				onAuthStateChanged={onAuthStateChanged}
			>
				{children}
			</AWSAuthProviderContent>
		</Authenticator.Provider>
	);
}

export default AWSAuthProvider;
