import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * FuseHighlight Doc
 * This document provides information on how to use the FuseHighlight.
 */
function FuseHighlightDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				FuseHighlight
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FuseHighlight</code> is a custom-built Fuse component allows us to show syntax highlighted codes
				with
				<a
					href="http://prismjs.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="ml-2"
				>
					PrismJS
				</a>
				.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Usage
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{`
                                 <FuseHighlight component="pre" className="language-html">
                                   <div className="title">
                                        <span>Example Title</span>
                                    </div>
                                 </FuseHighlight>
                                `}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Preview
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-html"
			>
				{`
                            <div className="title">
                                <span>Example Title</span>
                            </div>
                            `}
			</FuseHighlight>
		</>
	);
}

export default FuseHighlightDoc;
