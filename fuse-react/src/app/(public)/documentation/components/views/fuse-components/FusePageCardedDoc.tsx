import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

const demos = [
	{
		id: 'full-width',
		title: 'Full Width Overview',
		type: 'item',
		url: '/ui/page-layouts/carded/full-width/overview'
	},
	{
		id: 'with-sidebars',
		title: 'With Sidebars Overview',
		type: 'item',
		url: '/ui/page-layouts/carded/with-sidebars/overview'
	}
];

/**
 * FusePageCarded Doc
 * This document provides information on how to use the FusePageCarded.
 */
function FusePageCardedDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				FusePageCarded
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				<code>FusePageCarded</code> is the carded page layout component of the Fuse React.
			</Typography>
			<Typography
				className="mb-6"
				component="p"
			>
				The component has layout areas to easily enter the contents of the app.
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-jsx"
			>
				{`
           <FusePageCarded
                header={
                    Header
                }
                content={
                    Content
                }
                leftSidebarContent={
                    Left Sidebar Content
                }
                rightSidebarContent={
                    Right Sidebar Content
                }
                scroll="page"
            />
        `}
			</FuseHighlight>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Demos
			</Typography>

			<ul>
				{demos.map((demo) => (
					<li
						key={demo.url}
						className="mb-2"
					>
						<Link to={demo.url}>{demo.title}</Link>
					</li>
				))}
			</ul>
		</>
	);
}

export default FusePageCardedDoc;
