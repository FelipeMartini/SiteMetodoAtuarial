import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

/**
 * RTL Support Doc
 * This document provides information on how to use RTL support.
 */
function RTLSupportDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				RTL Support
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				Fuse React supports Right-to-left languages such as Arabic, Persian or Hebrew, etc.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Development
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				We used{' '}
				<a
					href="https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support"
					target="_blank"
					rel="noopener noreferrer"
				>
					TailwindCss's rtl and ltr modifiers
				</a>{' '}
				and the styles components plugin{' '}
				<a
					href="https://github.com/styled-components/stylis-plugin-rtl"
					target="_blank"
					rel="noopener noreferrer"
				>
					<code>stylis-plugin-rtl</code>
				</a>{' '}
				to support RTL feature of the Fuse React.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<a
					href="https://github.com/alitaheri/jss-rtl"
					target="_blank"
					rel="noopener noreferrer"
				>
					<code>stylis-plugin-rtl</code>
				</a>{' '}
				enables right-to-left support by flipping every rule of the jss styles on the x-axis. You can write the
				application left-to-right and then turn it into right-to-left using this plugin. Or you can start
				right-to-left and turn it into left-to-right.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<a
					href="https://tailwindcss.com/docs/hover-focus-and-other-states#rtl-support"
					target="_blank"
					rel="noopener noreferrer"
				>
					<code>TailwindCss's rtl and ltr modifiers</code>
				</a>{' '}
				are a custom direction variant to your tailwind project, letting you have custom CSS rules for LTR and
				RTL layouts. For example:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{`
            <div class="text-green-500 text-2xl ltr:pl-4 rtl:pr-4">
                Hello, world.
            </div>
        `}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Configuration
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				The theme's language direction depends on the theme language. So There is no need to define direction
				value. Checkout{' '}
				<Link
					className="link mx-2"
					to="/documentation/development/multi-language"
				>
					Multi Language configuration
				</Link>
			</Typography>
		</>
	);
}

export default RTLSupportDoc;
