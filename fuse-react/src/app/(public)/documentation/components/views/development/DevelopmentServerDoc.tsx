import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * Development Server Doc
 * This document provides information on how to run the development server.
 */
function DevelopmentServerDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Starting the Development Server
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				While in your working directory, execute the following command in the console application:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-bash my-4"
			>
				{` npm run dev `}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				And that's it. The generator will take care of everything and will initiate the Fuse React server.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				You can check your console application for further information about the server. By default, it will be
				running on <b>http://localhost:3000</b> although it could change depending on your setup.
			</Typography>

			<div className="my-6 rounded-xl border-1 border-red-500 px-6 py-4">
				<Typography className="mb-2 text-lg font-medium text-red-500">Important:</Typography>
				<Typography component="div">
					In case of runtime errors on first run, make sure you are running an LTS release of Node.js and that
					all dependencies are correctly installed. If issues persist, try deleting the node_modules folder
					and running `npm install` again.
				</Typography>
			</div>
		</>
	);
}

export default DevelopmentServerDoc;
