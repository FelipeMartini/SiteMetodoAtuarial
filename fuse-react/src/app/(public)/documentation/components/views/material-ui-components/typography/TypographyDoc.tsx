// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
'use client';

import FuseExample from '@fuse/core/FuseExample';
import FuseHighlight from '@fuse/core/FuseHighlight';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TypesComponent from '../../../ui/material-ui-components/typography/Types';
import TypesRaw from '../../../ui/material-ui-components/typography/Types.tsx?raw';
import TypographyThemeComponent from '../../../ui/material-ui-components/typography/TypographyTheme';
import TypographyThemeRaw from '../../../ui/material-ui-components/typography/TypographyTheme.tsx?raw';

function TypographyDoc(props) {
	return (
		<>
			<Button
				className="not-prose absolute right-0 normal-case"
				variant="contained"
				color="secondary"
				component="a"
				href="https://mui.com/components/typography"
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
				Typography
			</Typography>
			<Typography className="description">
				Use typography to present your design and content as clearly and efficiently as possible.
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Roboto font
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Material UI uses the <a href="https://fonts.google.com/specimen/Roboto">Roboto</a> font by default. Add
				it to your project via Fontsource, or with the Google Fonts CDN.
			</Typography>
			<div className="space-y-3">
				<FuseHighlight
					component="pre"
					className="language-bash npm"
				>
					{` 
npm install @fontsource/roboto
`}
				</FuseHighlight>

				<FuseHighlight
					component="pre"
					className="language-bash pnpm"
				>
					{` 
pnpm add @fontsource/roboto
`}
				</FuseHighlight>

				<FuseHighlight
					component="pre"
					className="language-bash yarn"
				>
					{` 
yarn add @fontsource/roboto
`}
				</FuseHighlight>
			</div>

			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Then you can import it in your entry point like this:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-tsx"
			>
				{` 
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
`}
			</FuseHighlight>
			<div className="my-3 rounded-xl border-1 p-4">
				<Typography
					className="mb-8 text-base"
					component="div"
				>
					Fontsource can be configured to load specific subsets, weights, and styles. Material UI&#39;s
					default typography configuration relies only on the 300, 400, 500, and 700 font weights.
				</Typography>
			</div>

			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Google Web Fonts
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To install Roboto through the Google Web Fonts CDN, add the following code inside your project&#39;s{' '}
				<code>{`<head />`}</code> tag:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-html"
			>
				{` 
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
/>
`}
			</FuseHighlight>
			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Component
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Usage
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Typography component follows the{' '}
				<a href="https://m2.material.io/design/typography/#type-scale">Material Design typographic scale</a>{' '}
				that provides a limited set of type sizes that work well together for a consistent layout.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="Types.js"
					className="my-4"
					iframe={false}
					component={TypesComponent}
					raw={TypesRaw}
				/>
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Theme keys
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In some situations you might not be able to use the Typography component. Hopefully, you might be able
				to take advantage of the{' '}
				<a href="/material-ui/customization/default-theme/?expand-path=$.typography">
					<code>typography</code>
				</a>{' '}
				keys of the theme.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				<FuseExample
					name="TypographyTheme.js"
					className="my-4"
					iframe={false}
					component={TypographyThemeComponent}
					raw={TypographyThemeRaw}
				/>
			</Typography>
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
				Adding &amp; disabling variants
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				In addition to using the default typography variants, you can add custom ones, or disable any you
				don&#39;t need. See the{' '}
				<a href="/material-ui/customization/typography/#adding-amp-disabling-variants">
					Adding &amp; disabling variants
				</a>{' '}
				page for more info.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				Changing the semantic element
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				The Typography component uses the <code>variantMapping</code> prop to associate a UI variant with a
				semantic element. It&#39;s important to realize that the style of a typography component is independent
				from the semantic underlying element.
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To change the underlying element for a one-off situation, like avoiding two <code>h1</code> elements in
				your page, use the <code>component</code> prop:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{` 
<Typography variant="h1" component="h2">
  h1. Heading
</Typography>
`}
			</FuseHighlight>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				To change the typography element mapping globally,{' '}
				<a href="/material-ui/customization/typography/#adding-amp-disabling-variants">use the theme</a>:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-js"
			>
				{` 
const theme = createTheme({
  components: {
    MuiTypography: {
      defaultProps: {
        variantMapping: {
          h1: 'h2',
          h2: 'h2',
          h3: 'h2',
          h4: 'h2',
          h5: 'h2',
          h6: 'h2',
          subtitle1: 'h2',
          subtitle2: 'h2',
          body1: 'span',
          body2: 'span',
        },
      },
    },
  },
});
`}
			</FuseHighlight>
			<Typography
				className="mt-5 mb-2.5 text-lg font-bold"
				component="h3"
			>
				System props
			</Typography>
			<div className="my-3 rounded-xl border-1 p-4">
				<Typography
					className="mb-8 text-base"
					component="div"
				>
					System props are deprecated and will be removed in the next major release. Please use the{' '}
					<code>sx</code> prop instead.
				</Typography>

				<FuseHighlight
					component="pre"
					className="language-diff"
				>
					{` 
- <Typography mt={2} />
+ <Typography sx={{ mt: 2 }} />
`}
				</FuseHighlight>
			</div>

			<Typography
				className="mt-6 mb-2.5 text-3xl font-bold"
				component="h2"
			>
				Accessibility
			</Typography>
			<Typography
				className="mb-8 text-base"
				component="div"
			>
				Key factors to follow for an accessible typography:
			</Typography>
			<ul className="space-y-4">
				<li>
					<strong>Color</strong>. Provide enough contrast between text and its background, check out the
					minimum recommended{' '}
					<a href="https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html">
						WCAG 2.0 color contrast ratio
					</a>{' '}
					(4.5:1).
				</li>
				<li>
					<strong>Font size</strong>. Use{' '}
					<a href="/material-ui/customization/typography/#font-size">relative units (rem)</a>, instead of
					pixels, to accommodate the user&#39;s browser settings.
				</li>
				<li>
					<strong>Heading hierarchy</strong>. Based on{' '}
					<a href="https://www.w3.org/WAI/tutorials/page-structure/headings/">the W3 guidelines</a>, don&#39;t
					skip heading levels. Make sure to{' '}
					<a href="#changing-the-semantic-element">separate the semantics from the style</a>.
				</li>
			</ul>
		</>
	);
}

export default TypographyDoc;
