import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';
import AppRaw from '@/app/App.tsx?raw';

/**
 * Theme Layouts Doc
 * This document provides information on how to use theme layouts.
 */
function FuseThemeDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				FuseTheme
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FuseTheme</code> is the theming component of the Fuse React. It allows us to change predefined
				Material UI themes. It should wrap the <code>FuseLayout</code> component.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>@/app/App.tsx</code>
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{AppRaw}
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
				Please checkout
				<Link
					className="mx-1 font-normal"
					to="/documentation/theming/theme-schemes"
				>
					theming
				</Link>
				at documentation.
			</Typography>
		</>
	);
}

export default FuseThemeDoc;
