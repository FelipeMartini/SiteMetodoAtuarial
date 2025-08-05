import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

/**
 * FuseLayout Doc
 * This document provides information on how to use the FuseLayout.
 */
function FuseLayoutDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				FuseLayout
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FuseLayout</code> is the main layout component of the Fuse React. It allows us to switch theme
				layouts, set layout settings based on the default configuration, and route configs.
			</Typography>

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
				Please checkout{' '}
				<Link
					className="font-normal"
					to="/documentation/theming/theme-layouts"
				>
					Theme Layouts
				</Link>{' '}
				at documentation.
			</Typography>
		</>
	);
}

export default FuseLayoutDoc;
