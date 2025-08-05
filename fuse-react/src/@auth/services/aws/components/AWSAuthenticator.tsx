import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import awsStyles from '@aws-amplify/ui-react/styles.css?inline';
import { styled } from '@mui/material/styles';
import { useAuthenticator } from '@aws-amplify/ui-react';
import FuseLoading from '@fuse/core/FuseLoading';
import { Global } from '@emotion/react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { AuthenticatorProps } from '@aws-amplify/ui-react/dist/types/components/Authenticator/Authenticator';

const Root = styled('div')(({ theme }) => ({
	'& [data-amplify-authenticator] [data-amplify-router]': {
		boxShadow: 'none'
	},
	'& [data-amplify-theme]': {
		fontSize: '0.8125rem',
		'--amplify-fonts-default-static': 'Geist,Roboto,"Helvetica",Arial,sans-serif',
		'--amplify-fonts-default-variable': 'Geist,Roboto,"Helvetica",Arial,sans-serif',
		'--amplify-font-sizes-xxxs': '0.375rem',
		'--amplify-font-sizes-xxs': '0.5rem',
		'--amplify-font-sizes-xs': '0.75rem',
		'--amplify-font-sizes-large': '0.875rem',
		'--amplify-font-sizes-medium': '0.8125rem',
		'--amplify-font-sizes-small': '0.75rem',
		'--amplify-font-sizes-xl': '0.9375rem',
		'--amplify-font-sizes-xxl': '1.25rem',
		'--amplify-font-sizes-xxxl': '1.5rem',
		'--amplify-font-sizes-xxxxl': '1.75rem',
		'--amplify-colors-font-primary': theme.vars.palette.text.primary,
		'--amplify-colors-font-secondary': theme.vars.palette.text.secondary,
		'--amplify-space-xxs': '0.625rem',
		'--amplify-space-xs': '0.6875rem',
		'--amplify-space-small': '0.75rem',
		'--amplify-space-medium': '1.5rem',
		'--amplify-space-large': '2rem',
		'--amplify-components-field-font-size': '0.8125rem',
		'--amplify-components-field-gap': '0.5rem',
		'--amplify-components-flex-gap': '1.25rem',
		'--amplify-components-button-small-padding-block-start': '0.6875rem',
		'--amplify-components-button-small-padding-block-end': '0.6875rem',
		'--amplify-components-button-padding-block-start': '0.45625rem',
		'--amplify-components-button-padding-block-end': '0.45625rem',
		'--amplify-components-authenticator-footer-padding-bottom': '0rem',
		'--amplify-space-relative-medium': '1.25rem',
		'--amplify-components-fieldcontrol-padding-block-start': '0.45625rem',
		'--amplify-components-fieldcontrol-padding-block-end': '0.45625rem',
		'--amplify-components-fieldcontrol-padding-inline-start': '0.6875rem',
		'--amplify-components-fieldcontrol-padding-inline-end': '0.6875rem',
		'--amplify-components-button-border-radius': '0.5rem',
		'--amplify-components-authenticator-form-padding': '0',
		'--amplify-components-authenticator-router-box-shadow-sm-xs': '0',
		'--amplify-components-authenticator-router-border-width': '0',
		'--amplify-components-authenticator-container-width-max': '100%',
		'--amplify-components-button-link-color': theme.vars.palette.secondary.main,
		'--amplify-components-button-link-hover-background-color': 'initial',
		'--amplify-components-button-link-active-background-color': 'initial',
		'--amplify-colors-font-hover': theme.vars.palette.secondary.dark,
		'--amplify-internal-button-background-color': 'transparent',
		'--amplify-internal-button-border-color': theme.vars.palette.secondary.main,
		'--amplify-colors-border-focus': theme.vars.palette.secondary.main,
		'--amplify-components-button-hover-border-color': theme.vars.palette.secondary.main,
		'--amplify-components-fieldcontrol-focus-border-color': theme.vars.palette.secondary.main,
		'--amplify-components-button-hover-background-color': 'transparent',
		'--amplify-components-button-active-background-color': 'transparent',
		'--amplify-components-button-link-overlay-active-background-color': theme.vars.palette.secondary.light,
		'--amplify-components-button-primary-background-color': theme.vars.palette.secondary.main,
		'--amplify-components-button-primary-hover-background-color': theme.vars.palette.secondary.dark,
		'--amplify-components-button-primary-active-background-color': theme.vars.palette.secondary.dark,
		'--amplify-components-button-primary-focus-background-color': theme.vars.palette.secondary.dark,
		'--amplify-components-button-font-weight': '500',
		'--amplify-components-button-link-border-width': '0',
		'--amplify-components-button-link-hover-border-width': '0',
		'--amplify-components-button-link-focus-box-shadow-sm-xs': '0',
		'--amplify-components-button-link-focus-background-color': 'initial',
		'--amplify-components-button-link-focus-color': theme.vars.palette.secondary.dark,
		'--amplify-components-fieldcontrol-focus-box-shadow': `0px 0px 0px 1px ${theme.vars.palette.secondary.main}`,
		'--amplify-components-fieldcontrol-focus-box-shadow-sm-xs': `0px 0px 0px 1px ${theme.vars.palette.secondary.main}`,
		'--amplify-components-authenticator-router-background-color': `initial`,
		'--amplify-components-alert-padding-block': `0.75rem`,
		'--amplify-components-alert-padding-inline': `0.75rem`,
		'--amplify-components-fieldcontrol-border-radius': `0.25rem`,
		'& .amplify-tabs__list': {
			display: 'none'
		},
		'& .amplify-alert': {
			borderRadius: 6
		},
		'& .amplify-alert__body': {
			fontSize: '0.75rem'
		},
		'& .amplify-field-group .amplify-field-group__outer-end .amplify-field-group__control': {
			borderRadius: '0 4px 4px 0'
		},
		'& .amplify-field-group .amplify-field-group__outer-start .amplify-field-group__control': {
			borderRadius: '4px 0 0 4px'
		},
		'& .amplify-divider--horizontal': {
			margin: '1rem 0'
		},
		'& .amplify-divider::after': {
			backgroundColor: theme.vars.palette.background.paper
		}
	}
}));

function AwsAuthenticator(props: AuthenticatorProps) {
	const { toSignIn, toSignUp, authStatus } = useAuthenticator();
	const { initialState } = props;

	useEffect(() => {
		if (initialState === 'signUp') {
			toSignUp();
		}

		if (initialState === 'signIn') {
			toSignIn();
		}
		// eslint-disable-next-line
	}, []);

	if (authStatus === 'authenticated') {
		return (
			<div className="flex w-full flex-col items-center justify-center gap-6 py-16">
				<FuseLoading />
			</div>
		);
	}

	return (
		<Root className="w-full">
			<Global styles={awsStyles} />
			<ThemeProvider>
				<Authenticator {...props} />
			</ThemeProvider>
		</Root>
	);
}

export default AwsAuthenticator;
