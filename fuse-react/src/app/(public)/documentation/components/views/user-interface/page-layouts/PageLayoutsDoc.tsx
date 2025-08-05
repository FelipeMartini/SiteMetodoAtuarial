import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

/**
 * Page Layouts Doc
 * This document provides information on how to use the page layout components.
 */
function PageLayoutsDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Page Layouts
			</Typography>
			<div className="prose prose-sm dark:prose-invert">
				<Typography className="mb-4 text-2xl font-bold">Introduction</Typography>
				<Typography>
					Page layouts are set of pre-made layouts that can be used as the starter on any page/app design.
					While they provide some styling by default, it's very minimal and can be easily modified from the
					component you create.
				</Typography>
				<Typography>Main benefits of using page layouts are;</Typography>
				<Typography component="ul">
					<li>
						<p>
							<strong>Consistency</strong>
						</p>
						Your apps and pages will all look similar in terms of layout and general styling which
						essentially make them more user friendly and easy to learn.
					</li>
					<li>
						<p>
							<strong>Easy modifications</strong>
						</p>
						In the future, if you decide to change the design of your pages, add elements or modify the
						existing ones, it can be done very easily since all your pages will be sharing same class names
						and the general code structure.
					</li>
					<li>
						<p>
							<strong>Easier learning curve for your users</strong>
						</p>
						Making the general design and layout of your pages similar will make them easier to learn for
						your users. They won't be looking for a save button or a search field over and over again,
						trying to find and memorize their locations for each page since all pages will be sharing a
						similar structure.
					</li>
				</Typography>
			</div>

			<Typography
				className="mb-4"
				component="p"
			>
				One of the strong sides of the Fuse React is its Page layout components.
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				Every single app, pre-built pages uses the Fuse React's page layout components.
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				Simply, page layout components are pre-built layouts which you can simply copy/paste and start building
				your own page or app based on it.
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				Because page layout components, it's very easy to replicate any page style that you can find in Fuse
				React.
			</Typography>

			<Typography
				className="mt-5 mb-2.5 text-2xl font-bold"
				variant="h5"
			>
				Page Layout Components
			</Typography>

			<Typography
				className="my-4"
				component="div"
			>
				<ul>
					<li className="mb-2">
						<Link to="/documentation/fuse-components/fuse-page-simple">FusePageSimple</Link>
					</li>
					<li className="mb-2">
						<Link to="/documentation/fuse-components/fuse-page-carded">FusePageCarded</Link>
					</li>
				</ul>
			</Typography>
		</>
	);
}

export default PageLayoutsDoc;
