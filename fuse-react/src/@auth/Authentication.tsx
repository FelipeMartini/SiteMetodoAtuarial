import React from 'react';

import AWSAuthProvider from '@auth/services/aws/AWSAuthProvider';
import FirebaseAuthProvider from '@auth/services/firebase/FirebaseAuthProvider';
import JwtAuthProvider from '@auth/services/jwt/JwtAuthProvider';
import { FuseAuthProviderType } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import FuseAuthProvider from '@fuse/core/FuseAuthProvider';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import { User } from '@auth/user';
/**
 * The Authentication providers.
 */
const authProviders: FuseAuthProviderType[] = [
	{
		name: 'jwt',
		Provider: JwtAuthProvider
	},
	{
		name: 'aws',
		Provider: AWSAuthProvider
	},
	{
		name: 'firebase',
		Provider: FirebaseAuthProvider
	}
];

type AuthenticationProps = {
	children: React.ReactNode;
};

function Authentication(props: AuthenticationProps) {
	const { children } = props;

	return (
		<FuseAuthProvider providers={authProviders}>
			{(authState) => {
				const userRole = authState?.user?.role as User['role'];
				return <FuseAuthorization userRole={userRole}>{children}</FuseAuthorization>;
			}}
		</FuseAuthProvider>
	);
}

export default Authentication;
