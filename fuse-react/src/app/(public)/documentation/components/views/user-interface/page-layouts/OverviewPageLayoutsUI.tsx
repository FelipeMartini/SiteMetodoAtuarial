'use client';
import Typography from '@mui/material/Typography';
import Link from '@fuse/core/Link';

/**
 * The OverviewPageLayoutsUI component provides an overview of Fuse React's page layouts.
 */
function OverviewPageLayoutsUI() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Page Layouts
			</Typography>

			<section className="prose prose-sm dark:prose-invert">
				<Typography
					variant="h5"
					className="mb-4 text-2xl font-bold"
				>
					Introduction
				</Typography>
				<Typography paragraph>
					Page layouts in Fuse React are pre-designed, customizable templates that serve as the foundation for
					your application's pages. They offer a balance between consistency and flexibility, allowing you to
					rapidly develop user interfaces while maintaining a cohesive look and feel across your application.
				</Typography>

				<Typography
					variant="h6"
					className="mt-6 mb-4 text-xl font-semibold"
				>
					Key Benefits
				</Typography>
				<ul>
					<li>
						<strong>Consistency:</strong> Ensure a uniform look and feel across your application, enhancing
						user experience and navigation.
					</li>
					<li>
						<strong>Efficiency:</strong> Accelerate development by starting with pre-built, tested layouts.
					</li>
					<li>
						<strong>Flexibility:</strong> Easily customize and extend layouts to meet specific requirements.
					</li>
					<li>
						<strong>Maintainability:</strong> Simplify future updates and modifications with a standardized
						structure.
					</li>
				</ul>

				<Typography
					variant="h6"
					className="mt-6 mb-4 text-xl font-semibold"
				>
					Using Page Layouts
				</Typography>
				<Typography paragraph>
					Fuse React's page layouts are designed to be intuitive and easy to implement. Simply copy the
					desired layout component and customize it to fit your needs. This approach allows for rapid
					prototyping and development while maintaining a consistent user interface across your application.
				</Typography>
			</section>

			<section className="mt-8">
				<Typography
					variant="h5"
					className="mb-4 text-2xl font-bold"
				>
					Available Page Layout Components
				</Typography>
				<ul className="list-disc pl-6">
					<li className="mb-2">
						<Link
							to="/documentation/user-interface/page-layouts/simple/full-width"
							className="text-blue-500 hover:underline"
						>
							FusePageSimple
						</Link>
						- A versatile layout for general-purpose pages.
					</li>
					<li className="mb-2">
						<Link
							to="/documentation/user-interface/page-layouts/carded/with-sidebars"
							className="text-blue-500 hover:underline"
						>
							FusePageCarded
						</Link>
						- A layout featuring a prominent card-style content area.
					</li>
				</ul>
			</section>

			<Typography
				paragraph
				className="mt-8"
			>
				Explore the documentation for each layout component to learn more about their specific features and
				usage guidelines. By leveraging these pre-built layouts, you can significantly streamline your
				development process and create consistent, user-friendly interfaces with ease.
			</Typography>
		</>
	);
}

export default OverviewPageLayoutsUI;
