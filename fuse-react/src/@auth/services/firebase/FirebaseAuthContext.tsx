import { createContext } from 'react';
import { FirebaseSignInPayload, FirebaseSignUpPayload } from '@auth/services/firebase/FirebaseAuthProvider';
import { FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { User } from '@auth/user';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import firebase from 'firebase/compat';

export type FirebaseAuthContextType = FuseAuthProviderState<User> & {
	updateUser: (U: User) => Promise<Response>;
	signIn?: (credentials: FirebaseSignInPayload) => Promise<firebase.auth.UserCredential>;
	signUp?: (U: FirebaseSignUpPayload) => Promise<firebase.auth.UserCredential>;
	signOut?: () => void;
};

const defaultAuthContext: FirebaseAuthContextType = {
	authStatus: 'configuring',
	isAuthenticated: false,
	user: null,
	updateUser: null,
	signIn: null,
	signUp: null,
	signOut: null
};

const FirebaseAuthContext = createContext<FirebaseAuthContextType>(defaultAuthContext);

export default FirebaseAuthContext;
