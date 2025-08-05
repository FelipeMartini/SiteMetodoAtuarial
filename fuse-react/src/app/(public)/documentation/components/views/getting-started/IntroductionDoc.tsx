import Typography from '@mui/material/Typography';

/**
 * Introduction Doc
 * This document provides information on how to use Fuse React.
 */
function IntroductionDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Introduction
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				While Fuse React is a great tool and source for learning React, it also requires at least an entry-level
				of React, Tanstack Query, knowledge so you can find your way within the source code.
			</Typography>
			<Typography
				className="mb-8"
				component="p"
			>
				Here you can find a list of core libraries, design specifications, and coding standards that we use in
				Fuse React:
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				React
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				<a
					href="https://reactjs.org/"
					target="_blank"
					rel="noreferrer noopener"
				>
					React
				</a>{' '}
				is the core of our template. If you don't know what React is or don't know how to use it, we strongly
				recommend checking the React before start doing anything with Fuse.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Tanstack Query
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				<a
					href="https://tanstack.com/query/latest/docs/framework/react/overview"
					target="_blank"
					rel="noreferrer noopener"
				>
					Tanstack Query
				</a>{' '}
				is a library for managing server state in React applications.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Material-UI
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				<a
					href="https://mui.com"
					target="_blank"
					rel="noreferrer noopener"
				>
					Material-UI
				</a>{' '}
				is a react UI library that implements Google's Material Design specification.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				TailwindCSS
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				<a
					href="https://tailwindcss.com/"
					target="_blank"
					rel="noreferrer noopener"
				>
					TailwindCSS
				</a>{' '}
				It is the core of the style configuration and it provides utility classes for almost every CSS rule
				available.
			</Typography>
			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				ViteJS (CLI)
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				<a
					href="https://vitejs.dev/"
					target="_blank"
					rel="noreferrer noopener"
				>
					ViteJS
				</a>{' '}
				is a modern frontend build tool created to streamline the development of web applications. It enhances
				the development experience by offering fast server start and hot module replacement, eliminating the
				need for complex setup and configuration tasks.
			</Typography>
		</>
	);
}

export default IntroductionDoc;
