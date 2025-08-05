import Typography from '@mui/material/Typography';
import FuseHighlight from '@fuse/core/FuseHighlight/FuseHighlight';

function AuthenticationDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Authentication System
			</Typography>

			<Typography
				variant="body1"
				className="mb-6"
			>
				Fuse React's authentication system is designed to be flexible and robust, supporting multiple
				authentication services for a seamless and secure user experience. Currently, we provide three example
				authentication services:
			</Typography>

			<ol className="mb-6 flex list-disc flex-col gap-0.5 pl-4">
				<li>
					<Typography variant="body1">Firebase Authentication</Typography>
				</li>
				<li>
					<Typography variant="body1">JWT (JSON Web Tokens) Authentication</Typography>
				</li>
				<li>
					<Typography variant="body1">AWS Amplify Authentication</Typography>
				</li>
			</ol>

			<Typography
				variant="body1"
				className="mb-6"
			>
				This multi-service approach allows us to cater to a wide range of authentication requirements and
				preferences, providing developers with the flexibility to choose the service that best fits their
				project's needs.
			</Typography>

			<Typography
				variant="h5"
				className="mt-10 mb-5 font-bold"
			>
				Entry Point: Authentication Component
			</Typography>

			<Typography
				variant="body1"
				className="mb-6"
			>
				The <code>Authentication</code> component serves as the entry point for the authentication system. It
				wraps the main application components, ensuring that authentication context is available throughout the
				application.
			</Typography>

			<Typography
				variant="body1"
				className="mb-4"
			>
				Integration in <code>App.js</code>:
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{`
				return (
					<FuseTheme>
						<Authentication>
							<FuseLayout/>
						</Authentication>
					</FuseTheme>
				);
				`}
			</FuseHighlight>

			<Typography
				variant="h5"
				className="mt-10 mb-5 font-bold"
			>
				FuseAuthProvider Overview
			</Typography>

			<Typography
				variant="body1"
				className="mb-6"
			>
				The <code>FuseAuthProvider</code> is a context provider component that manages the authentication state
				across multiple authentication providers. It is responsible for:
			</Typography>
			<ul className="mb-6 flex list-disc flex-col gap-0.5 pl-4">
				<li>
					Managing the authentication state (<code>authState</code>) and the current provider.
				</li>
				<li>Handling authentication state changes from each provider.</li>
				<li>Providing methods for signing out and updating user information.</li>
				<li>Ensuring that the correct provider is used based on the stored authentication state.</li>
			</ul>

			<Typography
				variant="h5"
				className="mt-10 mb-5 font-bold"
			>
				Key Features of FuseAuthProvider
			</Typography>

			<ol className="mb-6 flex list-decimal flex-col gap-0.5 pl-4">
				<li>
					<Typography variant="body1">
						State Management: It maintains the authentication state, including whether the user is
						authenticated, the current provider, and the user's information.
					</Typography>
				</li>
				<li>
					<Typography variant="body1">
						Provider Nesting: It nests multiple authentication providers, allowing them to be used
						interchangeably. This is achieved by iterating over the list of providers and wrapping them
						around the application components.
					</Typography>
				</li>
				<li>
					<Typography variant="body1">
						Auth State Handling: It listens for authentication state changes from each provider and updates
						the global authentication state accordingly.
					</Typography>
				</li>
				<li>
					<Typography variant="body1">
						Local Storage: It uses local storage to remember the last used authentication provider, allowing
						for persistent sessions across page reloads.
					</Typography>
				</li>
				<li>
					<Typography variant="body1">
						Context Value: It provides a context value that includes methods for signing out, updating the
						user, and accessing the current authentication state.
					</Typography>
				</li>
			</ol>

			<Typography
				variant="h5"
				className="mt-10 mb-5 font-bold"
			>
				Usage in Authentication Component
			</Typography>

			<Typography
				variant="body1"
				className="mb-6"
			>
				The <code>Authentication</code> component uses <code>FuseAuthProvider</code> to wrap the application
				components, ensuring that authentication context and state are available throughout the application.
				Here's how it is integrated:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{`
import React from 'react';
import AWSAuthProvider from '@auth/services/aws/AWSAuthProvider';
import FirebaseAuthProvider from '@auth/services/firebase/FirebaseAuthProvider';
import JwtAuthProvider from '@auth/services/jwt/JwtAuthProvider';
import { FuseAuthProviderType } from '@fuse/core/FuseAuthProvider/types/FuseAuthTypes';
import FuseAuthProvider from '@fuse/core/FuseAuthProvider';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import { User } from '@auth/user';

const authProviders: FuseAuthProviderType[] = [
	{ name: 'jwt', Provider: JwtAuthProvider },
	{ name: 'aws', Provider: AWSAuthProvider },
	{ name: 'firebase', Provider: FirebaseAuthProvider }
];

type AuthenticationProps = {
	children: React.ReactNode;
};

function Authentication({ children }: AuthenticationProps) {
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
				`}
			</FuseHighlight>

			<Typography
				variant="h5"
				className="mt-10 mb-5 font-bold"
			>
				Explanation
			</Typography>

			<ul className="mb-6 flex list-disc flex-col gap-0.5 px-0">
				<li>
					<Typography variant="body1">
						Providers Array: The <code>authProviders</code> array defines the available authentication
						providers, each with a unique name and a corresponding provider component.
					</Typography>
				</li>
				<li>
					<Typography variant="body1">
						FuseAuthProvider: This component is used to wrap the children components, passing the{' '}
						<code>authProviders</code> array to manage the authentication state across these providers.
					</Typography>
				</li>
				<li>
					<Typography variant="body1">
						Children as Function: The <code>children</code> prop is a function that receives the current{' '}
						<code>authState</code>, allowing the <code>Authentication</code> component to determine the
						user's role and pass it to <code>FuseAuthorization</code>.
					</Typography>
				</li>
				<li>
					<Typography variant="body1">
						FuseAuthorization: This component is used to enforce role-based access control, ensuring that
						only authorized users can access certain parts of the application.
					</Typography>
				</li>
			</ul>

			<Typography
				variant="h5"
				className="mt-10 mb-5 font-bold"
			>
				Conclusion
			</Typography>

			<Typography
				variant="body1"
				className="mb-6"
			>
				The <code>FuseAuthProvider</code> is a central piece of the authentication system, enabling seamless
				integration and management of multiple authentication providers. It provides a flexible and scalable
				solution for handling authentication in a React application, ensuring that the authentication context is
				consistently available and up-to-date.
			</Typography>
		</>
	);
}

export default AuthenticationDoc;
