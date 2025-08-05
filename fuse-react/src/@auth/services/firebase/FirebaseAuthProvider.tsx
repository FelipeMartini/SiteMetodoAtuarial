import { useState, useEffect, useCallback, useMemo, useImperativeHandle } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { FuseAuthProviderComponentProps, FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { authCreateDbUser, authGetDbUserByEmail, authUpdateDbUser } from '@auth/authApi';
import { PartialDeep } from 'type-fest';
import { initializeFirebase } from './initializeFirebase';
import { User } from '../../user';
import { FirebaseAuthContextType } from './FirebaseAuthContext';
import FirebaseAuthContext from './FirebaseAuthContext';

export type FirebaseSignInPayload = {
	email: string;
	password: string;
};

export type FirebaseSignUpPayload = {
	email: string;
	password: string;
};

function FirebaseAuthProvider(props: FuseAuthProviderComponentProps) {
	const { ref, children, onAuthStateChanged } = props;

	/**
	 * Fuse Auth Provider State
	 */
	const [authState, setAuthState] = useState<FuseAuthProviderState<User>>({
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
	 * Initialize Firebase on load
	 */
	useEffect(() => {
		const initialized = initializeFirebase();

		if (!initialized) {
			setAuthState({
				authStatus: 'unauthenticated',
				isAuthenticated: false,
				user: null
			});
			return undefined;
		}

		/**
		 * Watch firebase auth state changes
		 */
		const unsubscribe = firebase.auth().onAuthStateChanged(
			async (firebaseUser) => {
				/**
				 * if user is logged in
				 * */
				if (firebaseUser) {
					const { currentUser: userAttributes } = firebase.auth();
					let userDbData: User;

					try {
						// Fetch user data from db
						const userResponse = await authGetDbUserByEmail(userAttributes.email);
						userDbData = userResponse as User;
					} catch (error) {
						console.error(error);

						// If user data doess not exist in db, create a new user record
						const newUserResponse = await authCreateDbUser({
							email: userAttributes.email,
							role: ['admin'],
							displayName: userAttributes.displayName,
							photoURL: userAttributes.photoURL
						});
						userDbData = newUserResponse as User;
					}

					setAuthState({
						user: userDbData,
						isAuthenticated: true,
						authStatus: 'authenticated'
					});
				} else {
					/**
					 * if user is not logged in, set auth state to unauthenticated
					 */
					setAuthState({
						authStatus: 'unauthenticated',
						isAuthenticated: false,
						user: null
					});
				}
			},
			(error) => {
				console.error('Error with Firebase Auth state:', error);
				setAuthState({
					authStatus: 'unauthenticated',
					user: null,
					isAuthenticated: false
				});
			}
		);

		/**
		 * Unsubscribe from firebase auth state changes
		 * */
		return () => {
			setAuthState({
				authStatus: 'configuring',
				isAuthenticated: false,
				user: null
			});
			unsubscribe?.();
		};
	}, []);

	/**
	 * Update user data in db
	 */
	const updateUser: FirebaseAuthContextType['updateUser'] = useCallback(async (_user: PartialDeep<User>) => {
		try {
			return await authUpdateDbUser(_user);
		} catch (error) {
			console.error('Error updating user:', error);
			return Promise.reject(error);
		}
	}, []);

	/**
	 * Sign in with email and password
	 */
	const signIn: FirebaseAuthContextType['signIn'] = useCallback(({ email, password }) => {
		try {
			return firebase.auth().signInWithEmailAndPassword(email, password);
		} catch (error) {
			console.error('Error signing in:', error);
			return Promise.reject(error);
		}
	}, []);

	/**
	 * Sign up with email and password
	 */
	const signUp: FirebaseAuthContextType['signUp'] = useCallback(async ({ email, password }) => {
		try {
			const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);

			return userCredential;
		} catch (error) {
			console.error('Error during sign up:', error);
			return Promise.reject(error);
		}
	}, []);

	/**
	 * Sign out
	 */
	const handleSignOut: FirebaseAuthContextType['signOut'] = useCallback(() => {
		firebase
			.auth()
			.signOut()
			.catch((error) => {
				console.error('Error signing out:', error);
			});
	}, []);

	/**
	 * Expose methods to the FuseAuthProvider
	 */
	useImperativeHandle(ref, () => ({
		signOut: handleSignOut,
		updateUser
	}));

	const authContextValue = useMemo(
		() => ({
			...authState,
			signIn,
			signUp,
			signOut: handleSignOut,
			updateUser
		}),
		[authState, signIn, signUp, handleSignOut, updateUser]
	);

	return <FirebaseAuthContext value={authContextValue}>{children}</FirebaseAuthContext>;
}

export default FirebaseAuthProvider;
