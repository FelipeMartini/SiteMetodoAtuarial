import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * Production Doc
 * This document provides information on how to build the application for production.
 */
function ProductionDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Production Build
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				The following command builds the application into an output directory:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-bash my-4"
			>
				{` npm run build `}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				compiles the application into <code>/build</code> directory
			</Typography>
		</>
	);
}

export default ProductionDoc;
