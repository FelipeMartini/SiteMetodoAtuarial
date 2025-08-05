import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
import settingsConfigRaw from 'src/configs/settingsConfig.ts?raw';

/**
 * Theme Layouts Doc
 * This document provides information on how to use theme layouts.
 */
function SettingsDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Default Settings
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				To set the default layout and theme settings for your app, navigate to the file:
				<code>src/configs/settingsConfig.ts</code>
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{settingsConfigRaw}
			</FuseHighlight>
		</>
	);
}

export default SettingsDoc;
