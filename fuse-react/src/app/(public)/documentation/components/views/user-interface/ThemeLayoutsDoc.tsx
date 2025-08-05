import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

/**
 * Theme Layouts Doc
 * This document provides information on how to use the theme layouts.
 */
function ThemeLayoutsDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Theme Layouts
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				Fuse comes with a variety of different Theme Layouts which you can see and try them from the
				configuration sidebar (Click on the animated, spinning cog button from the right side of your screen).
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				These layouts are accessible from <code>/src/components/theme-layouts</code> directory and you can
				modify them however you like. Each layout has its own options. Those options allow you to configure the
				layout elements such as Toolbar, Footer, and Navbar.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				File Structure
			</Typography>

			<Typography
				className="my-4"
				component="div"
			>
				Inside the <code>/src/components/theme-layouts</code> directory
				<ul className="my-2 ml-4 list-disc">
					<li className="mb-2">
						<b>/layout-1</b> :
						<ul className="my-2 ml-3">
							<li className="mb-2">
								<b>/components</b> : Contains Layout elements such as Toolbar, Footer, and Navbar.
							</li>
							<li className="mb-2">
								<b>/Layout1.tsx</b> : Layout 1 component
							</li>
							<li className="mb-2">
								<b>/Layout1.config.tsx</b> : Contains title, default configs and form options of the
								layout.
							</li>
						</ul>
					</li>
					<li className="mb-2">
						<b>/components</b> : Each layouts shares the components of this directory
					</li>
					<li className="mb-2">
						<b>/themeLayoutConfigs.tsx</b> : Imports all layout configs.
					</li>
					<li className="mb-2">
						<b>/themeLayouts.tsx</b> : Imports all layout components.
					</li>
					<li className="mb-2">
						<b>/layout-2</b>
					</li>
					<li className="mb-2">
						<b>/layout-3</b>
					</li>
				</ul>
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Configuring
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				Fuse React has a powerful layout system which allows you to configure and use a different layout per
				route.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				Each route can have its own layout configuration meaning that it's very easy to have pages like login
				page where there isn't any toolbar or navbar showing, without leaving the Fuse React.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				You can get more information about route configuration and its usage from{' '}
				<Link to="/documentation/configuration/routing">the Routing documentation page</Link>.
			</Typography>
		</>
	);
}

export default ThemeLayoutsDoc;
