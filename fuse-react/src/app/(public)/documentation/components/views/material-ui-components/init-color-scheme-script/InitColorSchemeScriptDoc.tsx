// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function InitColorSchemeScriptDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/init-color-scheme-script"
				target="_blank"
				role="button"
				size="small"
				startIcon={<FuseSvgIcon size={16}>lucide:square-arrow-out-up-right</FuseSvgIcon>}
			>
				Reference
			</Button>
			<Typography
				className="my-4 text-5xl font-bold"
				component="h1"
			>
				InitColorSchemeScript
			</Typography>
			<Typography className="description">
				The InitColorSchemeScript component eliminates dark mode flickering in server-side-rendered
				applications.
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Introduction
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The <code>InitColorSchemeScript</code> component is used to remove the dark mode flicker that can occur
				in server-side-rendered (SSR) applications. This script runs before React to attach an attribute based
				on the user preference so that the correct color mode is applied on first render.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For the best user experience, you should implement this component in any server-rendered Material UI app
				that supports both light and dark modes.
			</Typography>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Basics
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				First, enable CSS variables with <code>{`colorSchemeSelector: 'data'`}</code> in your theme.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data',
  },
});

function App() {
  return <ThemeProvider theme={theme}>{/* Your app */}</ThemeProvider>;
}
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Then, render the <code>InitColorSchemeScript</code> component as the first child of the{' '}
				<code>{`<body>`}</code> tag.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The sections below detail where to render the <code>InitColorSchemeScript</code> component when working
				with Next.js.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Next.js App Router
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Place the <code>InitColorSchemeScript</code> component in the root <code>layout</code> file:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
				title="src/app/layout.tsx"
			>
				{` 
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="data" />
        {props.children}
      </body>
    </html>
  );
}
`}
			</FuseHighlight>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Next.js Pages Router
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Place the <code>InitColorSchemeScript</code> component in a custom <code>_document</code> file:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
				title="pages/_document.tsx"
			>
				{` 
import { Html, Head, Main, NextScript } from 'next/document';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

export default function MyDocument(props) {
  return (
    <Html lang="en">
      <Head>{/* tags */}</Head>
      <body>
        <InitColorSchemeScript attribute="data" />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Customization
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Class attribute
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To attach classes to DOM elements, set the <code>attribute</code> prop to <code>{`"class"`}</code>.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
<InitColorSchemeScript attribute="class" />
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				This sets the class name on the color scheme node (which defaults to <code>{`<html>`}</code>) according
				to the user&#39;s system preference.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-html"
			>
				{` 
<html className="dark"></html>
`}
			</FuseHighlight>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Arbitrary attribute
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To attach arbitrary attributes to DOM elements, use <code>%s</code> as a placeholder on the{' '}
				<code>attribute</code> prop.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
<InitColorSchemeScript attribute="[data-theme='%s']" /> // <html data-theme="dark">
<InitColorSchemeScript attribute=".mode-%s" /> // <html className="mode-dark">
`}
			</FuseHighlight>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Default mode
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Set the <code>defaultMode</code> prop to specify the default mode when the user first visits the page.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				For example, if you want users to see the dark mode on their first visit, set the{' '}
				<code>defaultMode</code> prop to <code>{`"dark"`}</code>.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
<InitColorSchemeScript defaultMode="dark" />
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Caveats
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Attribute
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				When customizing the <code>attribute</code> prop, make sure to set the <code>colorSchemeSelector</code>{' '}
				in the theme to match the attribute you are using.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'same value as the \`attribute\` prop',
  },
});
`}
			</FuseHighlight>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Default mode
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				When customizing the <code>defaultMode</code> prop, make sure to do the same with the{' '}
				<code>ThemeProvider</code> component:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
<ThemeProvider theme={theme} defaultMode="dark">
`}
			</FuseHighlight>
		</>
	);
}

export default InitColorSchemeScriptDoc;
