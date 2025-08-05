import { ResourcesConfig } from 'aws-amplify';

type awsAuthConfig = ResourcesConfig & {
	[key: string]: unknown;
	oauth: Record<string, unknown>;
};

const awsAuthConfig: awsAuthConfig = {
	aws_project_region: import.meta.env.VITE_AWS_PROJECT_REGION,
	aws_cognito_identity_pool_id: import.meta.env.VITE_AWS_COGNITO_IDENTITY_POOL_ID,
	aws_cognito_region: import.meta.env.VITE_AWS_COGNITO_REGION,
	aws_user_pools_id: import.meta.env.VITE_AWS_USER_POOLS_ID,
	aws_user_pools_web_client_id: import.meta.env.VITE_AWS_USER_POOLS_WEB_CLIENT_ID,
	oauth: {
		domain: import.meta.env.VITE_AWS_OAUTH_DOMAIN,
		scope: ['phone', 'email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
		redirectSignIn: import.meta.env.VITE_AWS_OAUTH_REDIRECT_SIGN_IN,
		redirectSignOut: import.meta.env.VITE_AWS_OAUTH_REDIRECT_SIGN_OUT,
		responseType: 'code'
	},
	aws_cognito_verification_mechanisms: ['EMAIL'],
	federationTarget: 'COGNITO_USER_POOLS',
	aws_cognito_username_attributes: ['EMAIL'],
	aws_cognito_social_providers: ['GOOGLE'],
	aws_cognito_signup_attributes: ['EMAIL', 'NAME'],
	aws_cognito_mfa_configuration: 'OFF',
	aws_cognito_mfa_types: ['SMS'],
	aws_cognito_password_protection_settings: {
		passwordPolicyMinLength: 8,
		passwordPolicyCharacters: []
	}
};

export default awsAuthConfig;
