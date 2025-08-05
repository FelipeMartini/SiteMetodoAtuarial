import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * Changing Default Font Doc
 * This document provides information on how to change default font.
 */
function ChangingDefaultFontDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Changing default font
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				There is two way to inject font-family.
			</Typography>

			<ul className="ml-4 list-decimal">
				<li>
					<Typography className="mb-6">
						You can add the font link inside head of the public/index.html.
					</Typography>
					<FuseHighlight
						component="pre"
						className="language-html mb-6"
					>
						{`
                          <link href="https://fonts.googleapis.com/css?family=Roboto&amp;subset=vietnamese" rel="stylesheet">
                        `}
					</FuseHighlight>
				</li>
				<li>
					<Typography className="mb-6">
						You can install typeface font package and import like we do at src/index.tsx
					</Typography>
					<FuseHighlight
						component="pre"
						className="language-jsx mb-6"
					>
						{`
                            import 'typeface-roboto';
                        `}
					</FuseHighlight>
				</li>
			</ul>

			<Typography
				className="mt-4 mb-2"
				component="p"
			>
				You need to add <code>typography.fontFamily</code> values into the desired theme config at{' '}
				<code>src/configs/themesConfig</code>
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-jsx mb-6"
			>
				{`
					default    : {
					  typography: {
						fontFamily: [
							'Roboto',
							'"Helvetica"',
							'Arial',
							'sans-serif'
						].join(','),
				`}
			</FuseHighlight>

			<Typography
				className="mt-4 mb-2"
				component="p"
			>
				There is also font-family assignment at <code>src/styles/app-base.css </code>
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-css mb-6"
			>
				{`
					html {
						font-size: 62.5%;
            font-family: 'Geist', Roboto, Helvetica Neue, Arial, sans-serif;
            background-color: #121212;
            -webkit-font-smoothing: antialiased;
            text-size-adjust: 100%;
					}
				`}
			</FuseHighlight>
		</>
	);
}

export default ChangingDefaultFontDoc;
