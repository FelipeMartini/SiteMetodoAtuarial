import { createContext } from 'react';

import { FuseAuthProviderState } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import { User } from '@auth/user';

export type AWSAuthContextType = FuseAuthProviderState & {
	updateUser: (U: User) => Promise<Response>;
	signOut?: () => Promise<void>;
};

const defaultAuthContext: AWSAuthContextType = {
	authStatus: 'configuring',
	isAuthenticated: false,
	user: null,
	updateUser: null,
	signOut: null
};

const AWSAuthContext = createContext<AWSAuthContextType>(defaultAuthContext);

export default AWSAuthContext;
