import FuseCountdown from '@fuse/core/FuseCountdown';
import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

/**
 * FuseCountdown Doc
 * This document provides information on how to use the FuseCountdown.
 */
function FuseCountdownDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				FuseCountdown
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FuseCountdown</code> is a custom-built Fuse component that allows you to create countdowns.
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
          <FuseCountdown endDate="2071-10-29" className="my-12"/>
        `}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Preview
			</Typography>

			<FuseCountdown
				endDate="2071-10-29"
				className="my-12"
			/>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Demos
			</Typography>

			<ul>
				<li className="mb-2">
					<Link to="/pages/coming-soon/classic">Coming Soon</Link>
				</li>
			</ul>
		</>
	);
}

export default FuseCountdownDoc;
