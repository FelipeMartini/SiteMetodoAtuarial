import Typography from '@mui/material/Typography';

/**
 * The TailwindCssUI page.
 */
function TailwindCssUI() {
	return (
		<>
			<Typography className="mb-10 text-4xl leading-none font-extrabold tracking-tight">TailwindCSS</Typography>
			<div className="flex-auto">
				<div>
					<Typography className="mb-4">
						As per the official page of Tailwind CSS, it is a highly customizable, low-level CSS framework
						that gives you all of the building blocks you need to build bespoke designs without any annoying
						opinionated styles you have to fight to override.
					</Typography>

					<Typography className="mb-4">
						To simply put, Tailwind provides helper classes for almost every CSS rule available. Fuse
						includes and uses Tailwind by default and it can be used in any part of the theme.
					</Typography>

					<Typography className="mt-8 mb-4 text-2xl font-bold">Styling in Material-UI</Typography>

					<Typography
						className="mb-4"
						component="p"
					>
						Fuse React developed based on Material-UI as ui library.
						<a
							className="mx-1"
							href="https://mui.com/system/basics/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Material-UI's styling solution
						</a>
						uses emotion at its core. Therefore the Fuse React supports
						<a
							className="mx-1"
							href="http://cssinjs.org/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Emotion
						</a>{' '}
						(Emotion is a library designed for writing css styles with JavaScript)
					</Typography>
				</div>

				<div>
					<Typography
						className="mt-8 mb-4 text-2xl font-bold"
						variant="h5"
					>
						Helper Classes with TailwindCSS
					</Typography>

					<Typography
						className="mb-4"
						component="p"
					>
						We are accepting JSS advantages but we can't leave <b>helper classes</b> for fast development,
						ease of use, globally access etc. So we have used both in components.
					</Typography>

					<Typography
						className="mb-4"
						component="p"
					>
						We are using
						<a
							className="mx-1"
							href="https://tailwindcss.com"
							target="_blank"
							rel="noopener noreferrer"
						>
							TailwindCSS
						</a>
						as an engine for generating helper classes. It's not an UI kit and it's customizable. You can
						find the config file of Tailwind with named "<b>tailwind.js</b>" under the root of Fuse React.
					</Typography>
				</div>

				<Typography className="mt-8 mb-4 text-2xl font-bold">Official docs</Typography>

				<Typography className="my-4">
					Official Tailwind CSS documentation:
					<Typography
						component="a"
						className="link mx-1"
						href="https://tailwindcss.com/"
						rel="noreferrer"
						target="_blank"
					>
						https://tailwindcss.com/
					</Typography>
				</Typography>
			</div>
		</>
	);
}

export default TailwindCssUI;
