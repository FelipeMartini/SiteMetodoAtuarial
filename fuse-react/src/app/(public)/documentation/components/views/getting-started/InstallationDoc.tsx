import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * Installation Doc
 * This document provides information on how to install Fuse React.
 */
function InstallationDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Installation
			</Typography>

			<Typography
				className="mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Prerequisites
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				This section will give you some information about what tools you will need.
			</Typography>

			<Typography
				className="mt-4 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				Node.js
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				To install and use Fuse React, you will need{' '}
				<a
					href="https://nodejs.org/"
					target="_blank"
					rel="noreferrer noopener"
				>
					Node.js
				</a>{' '}
				installed on your computer. We won't get into too much detail about Node.js as it's out of the scope of
				this documentation. Also, you won't need to use Node.js, it's only required for the development process.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Installation
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				A. Installing Prerequisites
			</Typography>

			<Typography component="div">
				Download and install <b>at least LTS</b> or the latest version of{' '}
				<a
					href="https://nodejs.org/"
					target="_blank"
					rel="noreferrer noopener"
				>
					Node.js
				</a>{' '}
				from its web site.
			</Typography>

			<Typography
				className="mt-6 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				B. Installing Fuse React
			</Typography>

			<Typography component="div">
				Before you begin installing Fuse, prepare a folder where you can unzip the downloaded .zip file.
			</Typography>

			<div className="mx-4 my-8">
				<Typography
					className="mb-2.5 flex text-lg font-bold"
					variant="h6"
				>
					B.1. Choose which version you want to install
				</Typography>

				<Typography component="div">
					When you unzip the .zip file you have downloaded from Themeforest, you will find 4 additional .zip
					files along with other files. You can choose React (Vite) or Next.js versions and both versions has
					demo and skeleton options.
				</Typography>

				<ul className="mx-4 list-disc">
					<ul>
						<Typography
							className="mt-3 flex flex-col gap-1"
							component="div"
						>
							<li>
								Fuse React ViteJs Demo Project <b>Fuse-React-vx.x.x-vitejs-demo.zip</b>
							</li>
							<li>
								Fuse React NextJs Demo Project <b>Fuse-React-vx.x.x-nextjs-demo.zip </b>
							</li>
						</Typography>
						<Typography
							className="mt-3"
							component="div"
						>
							This .zip file includes the Demo version which includes all the applications, pages and UI
							sections from the Demo application. This version is for referencing purposes only and it
							should be only used for copying code/modules from it.
						</Typography>
						<Typography
							className="mt-3"
							component="div"
						>
							<b>DO NOT</b> use the Demo version to build your app, otherwise you will have a lot of
							unnecessary weight to your app right from the start and it will provide a poor development
							experience.
						</Typography>
					</ul>

					<ul>
						<Typography
							className="mt-3 flex flex-col gap-1"
							component="div"
						>
							<li>
								Fuse React ViteJs Skeleton Project <b>Fuse-React-vx.x.x-vitejs-skeleton.zip</b>
							</li>
							<li>
								Fuse React NextJs Skeleton Project <b>Fuse-React-vx.x.x-nextjs-skeleton.zip</b>
							</li>
						</Typography>
						<Typography
							className="mt-3"
							component="div"
						>
							This .zip file includes the Skeleton version which includes all the core components and
							functionality of Fuse without the Demo applications, pages and UI sections. <b>DO</b> use
							the Skeleton version to build your app on top.
						</Typography>
					</ul>
				</ul>

				<Typography
					className="mt-8 mb-2.5 flex text-lg font-bold"
					variant="h6"
				>
					B.2. Unzip
				</Typography>

				<Typography component="div">
					After choosing the version you want to install, unzip the .zip file of that version into your
					workspace directory.
				</Typography>
			</div>

			<Typography
				className="mt-6 mb-2.5 text-lg font-bold"
				variant="h6"
			>
				C. Run the installation command
			</Typography>

			<Typography
				className="mb-4"
				component="div"
			>
				Open a console/terminal window and navigate into your workspace directory. You must be at the same
				folder with the package.json file in order to run the commands.
			</Typography>

			<Typography
				className="mb-4"
				component="div"
			>
				To complete the installation, enter the following command:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-bash mb-4"
			>
				{` npm install `}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="div"
			>
				This command will take some time and install all the required libraries into the node_modules directory
				in order for you to start developing.
			</Typography>
		</>
	);
}

export default InstallationDoc;
