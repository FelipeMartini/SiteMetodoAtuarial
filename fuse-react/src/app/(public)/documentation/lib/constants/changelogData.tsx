import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import Link from '@fuse/core/Link';
import { Alert, Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The changelog item type.
 */
export type ChangelogItemType = {
	version: string;
	date?: string;
	newChanges?: string[] | ReactNode[];
	fixedChanges?: string[] | ReactNode[];
	breakingChanges?: string[] | ReactNode[];
	notes?: ReactNode;
};

/**
 * The changelog data.
 */
const changelogData: ChangelogItemType[] = [
	{
		version: '16.0.0',
		date: '2025-07-09',
		newChanges: [
			'🔄 Migrated from Redux to TanStack Query for better state management',
			'📁 Restructured project with new feature-based directory organization',
			'🎨 Updated design system with modern UI components and improved aesthetics',
			'🔤 Changed default font to Geist for improved readability',
			'🎯 Migrated from Hero Icons to Lucide Icons',
			'🎭 Updated default theme and color schemes',
			'🚀 Added @tanstack/react-query (v5.74.7) for improved data fetching',
			'🛠️ Added @tanstack/react-query-devtools for development tools',
			'📡 Added ky (v1.8.1) HTTP client library',
			'⚡ Updated Vite.js to v6.3.5',
			'🎯 Updated MUI Base to v5.0.0-beta.70',
			'📊 Updated MUI X Data Grid to v8.7.0',
			'📅 Updated MUI X Date Pickers to v8.7.0',
			'💫 Updated Material UI Popup State to v5.3.6',
			'🎭 Enhanced UI/UX'
		],
		breakingChanges: [
			'Complete migration from Redux to TanStack Query - requires updating all data fetching logic',
			'Major directory structure reorganization',
			'Removed Redux store, actions, and reducers in favor of TanStack Query',
			'Changed state management patterns to align with TanStack Query best practices',
			'Icon system changed from Hero Icons to Lucide Icons - requires icon name updates',
			'Default font changed to Geist'
		],
		notes: (
			<div className="mt-10 mb-6 w-full max-w-2xl rounded-xl border-2 border-red-500 p-6 text-base">
				<Typography component="div">
					<Alert
						severity="warning"
						className="mb-4"
					>
						<Typography className="font-medium">Important Note for Production Projects</Typography>
						<Typography>
							This version introduces significant architectural changes. If you have a mature,
							production-ready project, you may want to stay on the previous version. The migration effort
							might outweigh the benefits for established applications. Consider this update primarily for
							new projects or those in early development stages.
						</Typography>
					</Alert>
					<ul className="list-disc">
						<li className="leading-[2]">
							<b>Major State Management Change:</b> This version marks a significant shift from Redux to
							TanStack Query, offering improved data fetching, caching, and state management capabilities.
							This change requires updating existing data fetching logic but provides better performance
							and developer experience.
						</li>
						<li className="leading-[2]">
							<b>Directory Structure Update:</b> The project structure has been completely reorganized to
							follow a more feature-based approach:
							<ul className="mt-2 ml-4 list-disc">
								<li>
									Reorganized <code>components/</code> with clear separation of UI, views, and forms
								</li>
								<li>
									Optional directories (<code>contexts/</code>, <code>hooks/</code>, <code>lib/</code>
									, <code>types/</code>) for better code organization
								</li>
								<li>Clear guidelines for file placement and folder creation</li>
							</ul>
						</li>
						<li className="leading-[2]">
							<b>Design System Enhancements:</b>
							<ul className="mt-2 ml-4 list-disc">
								<li>New Geist font for improved readability and modern aesthetics</li>
								<li>Switched to Lucide Icons for a more consistent and maintainable icon system</li>
								<li>Refreshed color schemes and default theme for better visual hierarchy</li>
								<li>Enhanced component theming and dark mode support</li>
							</ul>
						</li>
						<li className="leading-[2]">
							<b>Migration Steps:</b>
							<ul className="mt-2 ml-4 list-disc">
								<li>Replace Redux actions/reducers with TanStack Query hooks</li>
								<li>Reorganize components following the new directory guidelines</li>
								<li>Update API integration to use the new ky HTTP client</li>
								<li>Update icon imports and names to use Lucide Icons</li>
								<li>Review layouts for potential font-related adjustments</li>
							</ul>
						</li>
					</ul>
				</Typography>
			</div>
		)
	},
	{
		version: '15.0.0',
		date: '2025-04-25',
		newChanges: [
			'React updated to v19.1.0',
			'MUI updated to v7.0.2',
			'Tailwindcss updated to v4.1.4',
			'Redux Toolkit updated to v2.7.0',
			'NextJs updated to v15.3.1',
			'React Hook Form updated to v7.56.0',
			'Material React Table updated to v3.2.1',
			'React Hook Form Validation types refactored',
			'All dependency packages updated.'
		],
		breakingChanges: [
			'Rich text editor react-draft-wysiwyg removed, replaced with @tiptap/react.',
			"react-masonry-css removed, replaced with mui's masonry component.",
			'react-swipeable-views removed.',
			'draft-js removed.',
			'convert next.config.mjs to next.config.ts'
		]
	},
	{
		version: '14.0.4',
		date: '2025-03-23',
		fixedChanges: ['Page layout components and demos updated']
	},
	{
		version: '14.0.3',
		date: '2025-03-22',
		newChanges: ["refactor: update Dashboard's widget data extraction to use optional chaining for safer access"],
		fixedChanges: [
			'Update layout components to enhance container responsiveness with media queries and fullwidth mode support',
			'AdjustFontSize component logic to use pixel values instead of percentage'
		]
	},
	{
		version: '14.0.2',
		date: '2025-03-06',
		fixedChanges: [
			'Tailwindcss media query breakpoints.',
			'Contacts App: Contact Form, on CountryCodeSelector change not updates the form.',
			'CountryCodeSelector aria-labelledby attribute update.'
		]
	},
	{
		version: '14.0.1',
		date: '2025-02-17',
		fixedChanges: ['The sidebar width cannot be applied on FusePageSimple/FusePageCarded page layout components.']
	},
	{
		version: '14.0.0',
		date: '2025-01-26',
		newChanges: ['🚀 Tailwindcss updated to v4'],
		notes: (
			<div className="mt-10 mb-6 w-full max-w-2xl rounded-xl border-2 p-6 text-base">
				<Typography component="div">
					<ul className="list-disc leading-[2]">
						<li>
							This major version upgrades <b>Tailwind CSS to version 4</b>, bringing significant
							improvements and new features
						</li>
						<li>
							We have adopted Tailwind CSS v4's default spacing and configuration values for better
							consistency and maintainability
						</li>
						<li>
							<b>
								<code>tailwindcss.config.js</code>
							</b>{' '}
							is no longer in use.
						</li>
						<li>
							The base font size has been updated to 16px to align with modern web standards and improve
							readability
						</li>

						<Alert
							severity="warning"
							className="mt-2 leading-[2]"
						>
							We provide a migration script at <code>src/utils/node-scripts/migrate-tw-classes.js</code>{' '}
							to help you update your project's Tailwind CSS classes for only this version.
							<br />
							Run{' '}
							<code className="rounded-md bg-orange-100 px-1 py-0.5 text-orange-800">
								node src/utils/node-scripts/migrate-tw-classes.js ./src
							</code>{' '}
							to update your project's classes.
							<br />
							Be careful with this script, it will replace all your Tailwind CSS classes with the new
							ones.
						</Alert>
					</ul>
				</Typography>
			</div>
		)
	},
	{
		version: '13.0.0',
		date: '2024-12-09',
		newChanges: [
			'🚀 React updated to v19',
			'🛣️ React Router updated to v7',
			'🎨 Material-UI updated to v6.1.10',
			'⚡ Next.js updated to v15.0.4',
			'🔐  Auth.js updated',
			'🗺️ google-map-react replaced with @react-google-maps/api',
			'🔧 ESLint configuration updated to use flat config',
			'📊 Apex Charts updated to v4.1.0',
			'🎯 Tailwind CSS updated to v3.4.16',
			'🛠️ Added @hookform/devtools example usage',
			'📚 MUI documentation updated',
			'🔄 Node.js minimum version updated to v22.12.0 (LTS)',
			'📦 npm minimum version updated to v10.9.0'
		],
		breakingChanges: ['forwardRef removed (deprecated in React v19)', 'React v19 migrations applied'],
		fixedChanges: [
			'AWS authentication fixes',
			'CSS property fixes in app-base.css',
			'Various type fixes',
			'React v19 compatibility issues resolved'
		],
		notes: (
			<div className="mt-10 mb-6 w-full max-w-2xl rounded-xl border-2 p-6 text-base">
				<Typography component="div">
					<ul className="list-disc">
						<li className="leading-[2]">
							This major version includes significant updates to core dependencies and requires React 19
							compatibility.
						</li>
						<li className="leading-[2]">
							The Google Maps integration has been completely revamped with the new @react-google-maps/api
							library.
						</li>
						<li className="leading-[2]">
							ESLint now uses the new flat config system which may require updates to your custom
							configurations.
						</li>
					</ul>
				</Typography>
			</div>
		)
	},
	{
		version: '12.1.0',
		date: '2024-11-10',
		newChanges: [
			<span key="ai-image-generator">
				🚀 AI Image Generation App (DALL-E 3) added. <Link to="/apps/ai-image-generator">Checkout!</Link>
			</span>
		]
	},
	{
		version: '12.0.0',
		date: '2024-10-21',
		newChanges: [
			'🚀 Fuse React Nextjs version launched!',
			'🎨 Material-UI (MUI) updated to v6+.',
			'📚 Documentation layout updated with improved navigation and additional pages for better user experience.',
			'🔐 Vitejs version: Authentication system refactored for easier configuration and better multi provider support.',
			'🛠️ Mock Service Worker (MSW) integrated to simulate API requests, facilitating easier development and testing.'
		],
		breakingChanges: [
			'🏗️ Mock API specifications restructured to align with improved database architecture.',
			"🔄 Axios library removed in favor of native 'fetch' API for more lightweight and standardized HTTP requests.",
			"🔧 Axios mock adapter replaced with 'msw' for more flexible and powerful request mocking.",
			"📦 '@lodash' package removed, now using standard 'lodash' library for utility functions.",
			'🔀 Redux slices (FuseSettingsSlice, userSlice, i18nSlice) replaced with React Context Providers for better state management.',
			'@hello-pangea/dnd removed, replaced with @hello-pangea/dnd.',
			<span key="vite-js-note">
				ViteJs "JS" version is no longer supported. You can use the TypeScript compiler (tsc) to compile your
				TypeScript code into JavaScript. For more information on how to use the TypeScript compiler, refer to
				the official TypeScript documentation:{' '}
				<a
					href="https://www.typescriptlang.org/docs/handbook/compiler-options.html"
					target="_blank"
					rel="noreferrer"
				>
					https://www.typescriptlang.org/docs/handbook/compiler-options.html
				</a>
			</span>
		],
		notes: (
			<Alert
				classes={{
					root: 'flex flex-col sm:flex-row justify-center items-center sm:justify-start',
					action: 'flex sm:items-center justify-center w-full sm:w-auto'
				}}
				severity="info"
				className="mb-1.5"
				icon={<>🚀</>}
				action={
					<Button
						component="a"
						href="https://fuse-react-nextjs-demo.fusetheme.com"
						target="_blank"
						variant="outlined"
						color="inherit"
						size="small"
						role="button"
						startIcon={
							<div className="flex items-center">
								<img
									src="/assets/images/logo/nextjs.svg"
									alt="Nextjs Logo"
									className="h-6 dark:hidden"
								/>
								<img
									src="/assets/images/logo/nextjs-dark.svg"
									alt="Nextjs Logo"
									className="hidden h-6 dark:block"
								/>
							</div>
						}
						endIcon={<FuseSvgIcon size={16}>lucide:arrow-right</FuseSvgIcon>}
					>
						Go to the demo
					</Button>
				}
			>
				<Typography
					variant="h6"
					className="text-center font-extrabold"
				>
					Fuse React Nextjs version launched!
				</Typography>
				<Typography
					variant="body1"
					className="mt-0.25 text-center font-medium"
				>
					Bringing server-side rendering capabilities with Nextjs.
				</Typography>
			</Alert>
		)
	},
	{
		version: '11.1.0',
		date: '2024-08-19',
		newChanges: [
			'vite.config.mts configured to expose the host to the local network by default.',
			'Components validated to be compatible with Fast Refresh.',
			'eslint-plugin-react-refresh ESLint plugin installed.'
		],
		fixedChanges: ['ESLint warnings resolved.', 'Mobile scroll issues fixed.']
	},
	{
		version: '11.0.0',
		date: '2024-08-18',
		newChanges: [
			'Created a 401 error page.',
			'Added useFuseRouteParameter.tsx for managing route parameters.',
			'Added a copy button to the FuseHighlight component.',
			'Enhanced the Icon List page to allow automatic copying of icon names on click.',
			'Created PageBreadcrumb component and integrated it across various pages and apps.',
			'Automated route configuration generation, eliminating manual imports in routesConfig.tsx.',
			'Added FuseTabs and FuseTab components for improved tab appearance.',
			'Refined main theme styles for better enterprise and modern usage.',
			'Updated default theme colors.',
			'Created LightDarkModeToggle component.',
			'Restyled the User Menu and moved it to the Navbar footer.',
			'Updated tailwindconfig.js for additional customization.',
			'Updated default font and icon sizes.',
			'Replaced Hero-icon SVGs with the latest version.',
			'Created FuseLayoutConfig components to simplify FuseSettings code and added number input validation for layoutConfig.containerWidth.',
			'Performance improvements.',
			'Dependencies updated.'
		],
		fixedChanges: [
			'Resolved an issue with error handling in JWT SignIn/SignUp forms.',
			'Updated mobile styles across the application.',
			'Multiple RTL support fixes.'
		],
		breakingChanges: [
			'Renamed all *Config.tsx files to *Route.tsx.',
			'Removed @history package.',
			'Re-configured the router to support React Router v6’s new data APIs.'
		],
		notes: (
			<div className="mt-10 mb-6 w-full max-w-2xl rounded-xl border-2 border-red-500 p-6 text-base">
				<ul className="list-disc">
					<Typography
						component="li"
						className="leading-[2]"
					>
						The routing system has been updated to support React Router v6’s new data APIs.
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						With the new routing system, all *Config.tsx files have been renamed to *Route.tsx.
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						You don’t need to manually import routes anymore. The new routing system automatically populates
						all routes in routesConfig.tsx.
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						Checkout the documentation at <Link to="/documentation/configuration/routing">Routing</Link> for
						more.
					</Typography>
				</ul>
			</div>
		)
	},
	{
		version: '10.5.1',
		date: '2024-07-23',
		fixedChanges: ['Fixed Firebase authentication redirect issue after registration.'],
		breakingChanges: []
	},
	{
		version: '10.5.0',
		date: '2024-07-03',
		newChanges: [
			<span key="settings-app">
				<Link to="/apps/settings">Settings App/Page</Link> created.
			</span>
		],
		fixedChanges: [],
		breakingChanges: []
	},
	{
		version: '10.4.0',
		date: '2024-06-10',
		newChanges: [
			'React version updated to v18.3.1.',
			'Mui updated to v5.15.19.',
			'Tailwindcss updated to v3.4.4.',
			'All dependency packages updated.',
			'new date-fns version imports updated due to ts type detection.',
			'.eslintrc.cjs updated.',
			'Minor lint fixes.',
			'NotificationPanelButton animation added, triggers when a new notification is received.',
			'Notification list default order changed to time desc.',
			'All .defaultProps definitions removed due to will be deprecated on next major react release.',
			'DateTimePicker controllers updated.',
			'AWS Auth Social Login Google example added. '
		],
		fixedChanges: [],
		breakingChanges: []
	},
	{
		version: '10.3.0',
		date: '2024-04-03',
		newChanges: ['Aws Amplify authentication service example added.', 'Dependency packages updated'],
		fixedChanges: [
			"Mailbox: MailItem checkbox's click event cannot stop propagation on Firefox",
			'FuseSearch: Misaligned popper issue resolved in horizontal layouts.'
		],
		breakingChanges: ['Authentication system refactored.']
	},
	{
		version: '10.2.0',
		date: '2024-03-04',
		newChanges: [
			'material-react-table library added',
			'E-commerce products and orders page tables changed with material-react-table',
			'@reduxjs/toolkit updated to v2.2.1'
		],
		breakingChanges: [
			'Redux slices and RTK-Query have been enhanced by leveraging the latest version of the Redux Toolkit for optimized lazy loading.'
		]
	},
	{
		version: '10.1.0',
		date: '2024-02-14',
		newChanges: ['Js versions added.']
	},
	{
		version: '10.0.0',
		date: '2024-01-19',
		newChanges: [
			'RTK Query added for data fetching.',
			'ViteJS generator added for faster development. Changed from Create React App.',
			'New Authentication provider created.',
			'Firebase authentication service example added.',
			'Jwt authentication updated.',
			'Notifications App created.',
			'Material UI updated to v5.15.5',
			'New theme selector added into the theme panel.',
			'New color schemes added.',
			'Performance improvements.',
			'mock-api data updated.'
		],
		breakingChanges: [
			'Create React App changed with ViteJs.',
			'All api endpoints moved from ..Slice.ts files into ..Api.ts files.',
			'...Api.ts files created for rtk query api endpoints.',
			'All types moved into the ...Api.ts files.',
			'fuse, auth, navigation, settings slices lazy loaded from its own components with HOC'
		],
		notes: (
			<div className="mt-10 mb-6 w-full max-w-2xl rounded-xl border-2 p-6 text-base">
				<ul className="list-disc">
					<Typography
						component="li"
						className="mb-4 leading-[2]"
					>
						Transitioning to the new major release (v10.0.0) may present challenges, because of the RTK
						Query integration.
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						You may find this page helpful:{' '}
						<a
							href="https://redux-toolkit.js.org/rtk-query/usage/migrating-to-rtk-query"
							target="_blank"
							rel="noopener noreferrer"
						>
							Migrating to RTK Query
						</a>
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						Starting with the latest skeleton version of Fuse React offers a pristine base, facilitating a
						smoother transition of your codebase to the new version. This approach streamlines the process,
						making it more straightforward and efficient.
					</Typography>
				</ul>
			</div>
		)
	},
	{
		version: '9.0.0',
		date: '2023-10-16',
		newChanges: [
			'Transitioned the codebase from JavaScript to TypeScript.',
			'Upgraded all dependencies to their latest stable versions.',
			'Enhanced application performance through code optimization and bundle size reduction.',
			'Introduced new features and functionalities.'
		],
		breakingChanges: [
			'The entire JavaScript codebase has been transitioned to TypeScript, necessitating potential updates to existing code.',
			'Some APIs and interfaces have changed due to the conversion to TypeScript'
		],
		notes: (
			<div className="mt-10 mb-6 w-full max-w-2xl rounded-xl border-2 p-6 text-base">
				<ul className="list-disc">
					<Typography
						component="li"
						className="mb-4 leading-[2]"
					>
						Transitioning to the new major release (v9.0.0) may present challenges due to the shift to
						TypeScript.
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						You may find this page helpful:{' '}
						<a
							href="https://react-typescript-cheatsheet.netlify.app/docs/migration/"
							target="_blank"
							rel="noopener noreferrer"
						>
							Migrating (to TypeScript) Cheatsheet
						</a>
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						You may also want to consider starting with the latest skeleton version of Fuse React, which is
						a clean slate, and then move your codebase to the new version. This can make the migration
						process easier and more efficient.
					</Typography>
				</ul>
			</div>
		)
	},
	{
		version: '8.3.8',
		date: '2023-07-03',
		newChanges: [
			'material-ui updated to v5.13.6',
			'react-router updated to v6.14.1',
			'react-redux updated to v8.1.1',
			'react-hook-form updated to v7.45.1',
			'All dependency packages updated.'
		]
	},
	{
		version: '8.3.7',
		date: '2023-05-29',
		newChanges: [
			'material-ui updated to v5.13.12',
			'react-router updated to v6.11.2',
			'tailwindcss updated to v3.3.2',
			'@reduxjs/toolkit updated to v1.9.5',
			'axios updated to v1.4.0',
			'fullcalendar updated to v6.1.8',
			'All dependency packages updated.'
		],
		fixedChanges: ['User role specific redirectUrl issue fixed.']
	},
	{
		version: '8.3.6',
		date: '2023-04-07',
		fixedChanges: ['Tasks App: dueDate input field fixed.']
	},
	{
		version: '8.3.5',
		date: '2023-04-04',
		newChanges: [
			'material-ui updated to v5.11.15',
			'react-router updated to v6.10',
			'tailwindcss updated to v3.3.1',
			'@reduxjs/toolkit updated to v1.9.3',
			'axios updated to v1.3.4',
			'fullcalendar updated to v6.1.5',
			'All dependency packages updated.'
		],
		fixedChanges: [
			'Chat Panel, custom scrollbars of messages are disabled due to scroll Bottom not works',
			'Chat App, custom scrollbars of messages are disabled due to scroll Bottom not works.'
		],
		breakingChanges: [
			<span
				key="material-ui-update"
				className="flex flex-col space-y-2"
			>
				<Typography component="span">DateTimePicker migrated to v6</Typography>
				<Typography component="span">
					Please follow the migration guide at{' '}
					<a
						href="https://mui.com/x/migration/migration-pickers-v5/"
						target="_blank"
						rel="noopener noreferrer"
					>
						https://mui.com/x/migration/migration-pickers-v5/
					</a>
				</Typography>
			</span>
		]
	},
	{
		version: '8.3.0',
		date: '2022-12-30',
		newChanges: ['Crypto Dashboard created.'],
		fixedChanges: [
			'FusePageCarded Sidebar width value not applied on mobile.',
			'FusePageSimple Sidebar width value not applied on mobile.'
		]
	},
	{
		version: '8.2.2',
		date: '2022-12-15',
		newChanges: [
			'material-ui updated to v5.11.0',
			'react-router updated to v6.4.5',
			'tailwindcss updated to v3.2.4',
			'@reduxjs/toolkit updated to v1.8.6',
			'axios updated to v1.2.1',
			'fullcalendar updated to v6.0.0',
			'All dependency packages updated.'
		],
		fixedChanges: [
			'Navbar style 3 light theme.',
			'Performance refinements on FuseExample, FuseHighlight components, FuseSvgIcon'
		]
	},
	{
		version: '8.2.1',
		date: '2022-09-03',
		fixedChanges: ['DateTimePicker z-index issue, new import path.']
	},
	{
		version: '8.2.0',
		date: '2022-08-20',
		newChanges: [
			'Finance Dashboard added.',
			'material-ui updated to v5.10.1',
			'tailwindcss updated to v3.1.8',
			'react-hook-form updated to v7.34.2',
			'@reduxjs/toolkit updated to v1.8.5',
			'All dependency packages updated.'
		],
		fixedChanges: ['Theme Layout Navbar styles theming', 'FuseSidePanel max-height']
	},
	{
		version: '8.1.0',
		date: '2022-07-14',
		newChanges: [
			'react updated to v18.2.0',
			'material-ui updated to v5.9.0',
			'tailwindcss updated to v3.1.6',
			'react-hook-form updated to v7.33.1',
			'@reduxjs/toolkit updated to v1.8.3',
			'All dependency packages updated.',
			'Mock API Definitions page refined.'
		]
	},
	{
		version: '8.0.0',
		date: '2022-05-15',
		newChanges: [
			'Improved the look and feel',
			'Re-wrote the entire template from scratch',
			'Mock API regenerated using OPEN API definitions',
			'react updated to v18.1.0',
			'material-ui updated to v5.7.0',
			'@reduxjs/toolkit to v1.8.1',
			'tailwindcss updated to v3.0.24',
			'All dependency packages updated.'
		],
		breakingChanges: ['craco replaced with react-app-rewired.', 'firebase, auth0 service examples deprecated.'],
		fixedChanges: [],
		notes: (
			<div className="mt-10 mb-6 w-full max-w-2xl rounded-xl border-2 border-red-500 p-6 text-base">
				<ul className="list-disc">
					<Typography
						component="li"
						className="mb-4 leading-[2]"
					>
						This is the new major version of the Fuse React and it's completely different from previous
						versions with no upgrade path.
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						This version requires a clean installation.
					</Typography>
				</ul>
			</div>
		)
	},
	{
		version: '7.2.0',
		date: '2022-03-05',
		newChanges: [
			'material-ui updated to v5.4.4',
			'react-router updated to v6.2.2',
			'tailwindcss updated to v3.0.23',
			'@reduxjs/toolkit updated to v1.8.0',
			'All dependency packages updated.'
		],
		fixedChanges: [
			'/callback route component assignment.',
			'Authorization cannot hide navigation items in some cases.'
		]
	},
	{
		version: '7.1.0',
		date: '2021-12-17',
		newChanges: [
			'material-ui updated to v5.2.4',
			'react-router updated to v6.1.1',
			'tailwindcss updated to v3.0.5',
			'react-scripts updated to v5.0.0',
			'All dependency packages updated.'
		],
		breakingChanges: ['redirectUrl changed with loginRedirectUrl.']
	},
	{
		version: '7.0.2',
		date: '2021-10-25',
		newChanges: [
			'material-ui updated to v5.0.4',
			'tailwindcss updated to v2.2.17',
			'All dependency packages updated.',
			"Default font changed to 'Inter'"
		],
		breakingChanges: ['react-select removed.']
	},
	{
		version: '7.0.1',
		date: '2021-09-30',
		newChanges: [
			'material-ui updated to v5.0.2',
			'tailwindcss updated to v2.2.16',
			'All dependency packages updated.',
			'Codebase improved, minor fixes.'
		]
	},
	{
		version: '7.0.0',
		date: '2021-09-22',
		newChanges: ['material-ui migrated from v4 to v5', 'All dependency packages updated.', 'Codebase improved.'],
		breakingChanges: [
			'Switched yarn to npm.',
			'react-charjs2, Formsy libraries not support anymore.',
			'FuseAnimate, FuseGroupAnimate, FuseChipSelect Components are deprecated.'
		],
		notes: (
			<div className="mt-10 mb-6 w-full max-w-2xl rounded-xl border-2 p-6 text-base">
				<ul className="list-disc">
					<Typography
						component="li"
						className="mb-4 leading-[2]"
					>
						Migrating to the new major version (v7.0.0) can be difficult because of latest material-ui (v5)
						integration.
					</Typography>
					<Typography
						component="li"
						className="leading-[2]"
					>
						You should migrate to material v5 to get the benefits of bug fixes and a lot of improvements
						such as the new styling engine. Checkout material-ui migration guide at{' '}
						<a
							href="https://mui.com/guides/migration-v4"
							target="_blank"
							rel="noopener noreferrer"
						>
							https://mui.com/guides/migration-v4/
						</a>
					</Typography>
				</ul>
			</div>
		)
	},
	{
		version: '6.2.0',
		date: '2021-08-13',
		newChanges: [
			'material-ui updated to v4.12.3',
			'tailwindcss updated to v2.2.7',
			'All dependency packages updated.',
			'prettier config (.prettierrc) moved into eslint configuration file.',
			"Code formatting matched with Airbnb's style guide, eslint configuration file updated, code re-formatted."
		],
		fixedChanges: ["Chrome's autofill background color removed."]
	},
	{
		version: '6.1.4',
		date: '2021-06-12',
		fixedChanges: [
			'ChatPanel responsive positioning.',
			"Main Theme light or Main Theme Dark values shouldn't be listed in main theme select."
		]
	},
	{
		version: '6.1.3',
		date: '2021-06-03',
		fixedChanges: ["ChatPanel doesn't render correctly after changing the layout and reloading the page."]
	},
	{
		version: '6.1.2',
		date: '2021-06-03',
		newChanges: ['All dependency packages updated.']
	},
	{
		version: '6.1.1',
		date: '2021-04-07',
		newChanges: ['jss, jss-plugin-extend updated to v10.6.0'],
		fixedChanges: ['Page layouts inner scroll issue.']
	},
	{
		version: '6.1.0',
		date: '2021-04-07',
		newChanges: [
			<span key="react-hook-form-migration">
				react-hook-form migrated v6 to v7, <br />- Checkout migration guide at:{' '}
				<a
					href="https://react-hook-form.com/migrate-v6-to-v7/"
					target="_blank"
					rel="noopener noreferrer"
				>
					https://react-hook-form.com/migrate-v6-to-v7
				</a>
			</span>,
			'tailwindcss updated to v2.1.0'
		],
		fixedChanges: ['Yarn2 pnp warnings resolved.']
	},
	{
		version: '6.0.0',
		date: '2021-04-02',
		newChanges: [
			'Calendar App: react-big-calendar changed with fullCalendar/react',
			'draft-js and react-draft-wysiwyg added, an example created at mail compose form.',
			'croco added to extend webpack config.',
			'tailwindcss moved inside postcss config with croco.',
			'framer-motion added, all Animations migrated to framer-motion.',
			"Charts changed from 'react-chartjs-2' to 'react-apexcharts'",
			'All forms changed with react-hook-form, yup is used for form validation.',
			'The theme design refreshed with more modern approach.',
			'redux serializableCheck middleware disabled by default for development performance concerns.',
			'Default theme color scheme changed',
			"Default font changed to 'Poppins'",
			'All theme layouts updated, now body scroll is default.',
			'Theme vertical-layout-1 has new navigation styles (Slide, Tabbed, Tabbed dense, folded).',
			'redux-logger configuration: collapse all except errors on dev console.',
			'Unnecessary React imports removed.',
			'Notification Panel created.',
			'AdjustFontSize toolbar component created.',
			'react updated to v17.0.2',
			'react-scripts updated to v4.0.3',
			'material-ui updated to v4.11.3',
			'All dependency packages updated.'
		]
	},
	{
		version: '5.3.1',
		date: '2021-01-15',
		newChanges: [
			'material-ui updated to v4.11.2',
			'All dependency packages updated.',
			'Minor design refinements.',
			'Reset the whole redux store when user logged out.',
			'reportWebVitals added.',
			'data Model classes changed with function versions.'
		],
		fixedChanges: ['FuseChipSelect empty input height.']
	},
	{
		version: '5.3.0',
		date: '2020-12-02',
		newChanges: [
			'tailwindcss updated to v2',
			'material-ui updated to v4.11.1',
			'All dependency packages updated.',
			'E-Commerce App: Removing items functionality added into the Products and Orders Table. No result message created for non existed product/order page routes.',
			'Smooth shadows: Material design shadows changed with tailwindcss classes.'
		],
		fixedChanges: ['NotesApp dialog do not close when item removed.']
	},
	{
		version: '5.2.1',
		date: '2020-11-19',
		fixedChanges: ['ClickAwayListener included components not work.']
	},
	{
		version: '5.2.0',
		date: '2020-11-17',
		newChanges: [
			'react updated to v17.0.1,',
			'E-commerce App: showing loading indicator while fetching products/orders table data.',
			'NavbarFoldedToggleButton icon changed with push_pin',
			'FuseSearch: placeholder and noResults props added for localization.',
			'material ui icons updated and all variations added for to choose from.',
			'Mobile refinements: Drawer components changed with SwipeableDrawer, react-swipeable library added.',
			'Native scrollbar styles updated.',
			'tailwindcss updated to v1.9.6',
			'All dependency packages updated.'
		],
		fixedChanges: [
			'Language change dispatching should be called in the callback of the i18n.changeLanguage',
			'firebase individual SDK import error.'
		],
		breakingChanges: [
			'customScrollbars disabled by default due to performance reasons on development.',
			'tailwind.config.js updated.',
			'redux-toolkit immutableCheck middleware disabled by default for development performance.',
			'material ui icon fonts import location changed, checkout public/index.html'
		]
	},
	{
		version: '5.1.0',
		date: '2020-09-09',
		newChanges: [
			'FullScreenToggle added into the theme toolbars,',
			'i18nSlice created to store current language in redux store. changeLanguage action created and used in LanguageSwitcher.js',
			'Adjustments for better responsive design',
			'tailwindcss updated to v1.8.6',
			'All dependency packages updated.'
		],
		fixedChanges: [
			'FuseDialog and FuseMessage actions added into serializableCheck ignoredActions list.',
			'ScrumboardApp: non-existent board redirect error fixed.',
			'Formsy components missing color attribute added.',
			'theme layout footer cannot scroll on mobile.',
			'FuseSearch, FuseShortcuts cannot find translated navigation item, translation process moved into the redux store.'
		]
	},
	{
		version: '5.0.0',
		date: '2020-07-18',
		newChanges: [
			<span key="redux-toolkit">
				Migrated to the{' '}
				<a
					href="https://redux-toolkit.js.org/"
					target="_blank"
					rel="noopener noreferrer"
				>
					Redux-toolkit
				</a>{' '}
				(Official Redux library)'
			</span>,
			'Theme Color Schemes updated',
			'Color Schemes selection added into the SettingsPanel',
			'New Documentation layout created, and content updated.',
			"Default highlighting added to external links ('a.link, a:not([role=button])[target=_blank]').",
			'New Login/Register page added (LaginPage3, RegisterPage3) default login/register pages updated.',
			'Style changes applied for better theming',
			'material-ui updated to v4.11',
			'All dependency packages updated.'
		],
		notes: (
			<>
				<Typography
					className="mt-4 w-full max-w-2xl rounded-xl border-2 p-3 text-base"
					component="div"
				>
					Migrating to the new major version (v5.0.0) can be difficult because of redux-toolkit integration.
				</Typography>
				<Typography
					className="mt-4 w-full max-w-2xl rounded-xl border-2 p-3 text-base leading-[2]"
					component="div"
				>
					Some of the benefits of the redux-toolkit,
					<ul className="ml-4 list-disc">
						<li>redux-toolkit is an official redux library.</li>
						<li>The common redux dependencies included in the library</li>
						<ul className="ml-2">
							<li>"immer": "^7.0.3",</li>
							<li>"redux": "^4.0.0",</li>
							<li>"redux-thunk": "^2.3.0",</li>
							<li>"reselect": "^4.0.0"</li>
						</ul>
						<li>
							RTK resolves many of the arguments related to boilerplate and unnecessary code.
							<br />
							<ul className="ml-2">
								As mentioned in its official docs, it helps to solve three major problems people had
								with Redux:
								<li>“Configuring a Redux store is too complicated.”</li>
								<li>“I have to add a lot of packages to get Redux to do anything useful.”</li>
								<li>“Redux requires too much boilerplate code.”</li>
							</ul>
						</li>
						<li>
							It makes writing redux easier with the best practices. - Includes popular middlewares by
							default (redux-immutable-state-invariant, serializable-state-invariant-middleware thunk)
						</li>
						<li>
							Redux DevTools are supported by default and with a simple flag true or false - With the
							CreateSlice function, you don't always have to define action type, action, and reducer
							separately.
						</li>
						<li>It's possible to mutate state with included ImmerJS.</li>
						<li>
							With the help of another included library Reselect, the performance can be improved.
							<br />- createEntityAdapter function generates a set of prebuilt reducers and selectors for
							performing CRUD operations more easily.
						</li>
					</ul>
					<br />
					<b>With the changes, We've removed ~57 redux related files from the fuse-react.</b>
				</Typography>
			</>
		)
	},
	{
		version: '4.1.6',
		date: '2020-05-28',
		newChanges: [
			'material-ui updated to v4.10',
			'tailwindcss updated to v1.4.6',
			'All dependency packages updated.'
		],
		fixedChanges: ['Tooltip z-index issue.']
	},
	{
		version: '4.1.5',
		date: '2020-04-16',
		newChanges: [
			'material-ui updated to v4.9.10',
			'react updated to v16.13.1',
			'All dependency packages updated.',
			'hide/reveal button added to password input at the login page.'
		]
	},
	{
		version: '4.1.1',
		date: '2020-03-14',
		newChanges: ['important note added into the installation doc for to prevent yarn v2 issues.'],
		fixedChanges: ['Possible yarn, yarn2 package manager issues.']
	},
	{
		version: '4.1.0',
		date: '2020-03-13',
		newChanges: [
			'react updated to v16.13.0',
			'react-table updated to v7, also react-table docs and Contacts App table updated.',
			'formsy-react and its HOC`s updated',
			'material-ui updated to v4.9.5',
			'All dependency packages updated.',
			'performance improvements.',
			'input autofill backgroundColor changed to transparent.'
		],
		fixedChanges: ['FuseChipSelect error highligting.']
	},
	{
		version: '4.0.1',
		date: '2020-02-16',
		fixedChanges: ['react-scripts updated to v3.4.0 which is minor release and included mostly bug fixes.']
	},
	{
		version: '4.0.0',
		date: '2020-02-10',
		newChanges: [
			'Eslint, Prettier configuration based on Airbnb javascript style guide.',
			'Yarn v2 (package-manager) support',
			'.yarnrc.yml created for to resolve dependency issues (missing dependencies etc) for PnP',
			'IDEs (Webstorm, VSCode) titled documentation created.',
			'Toggle animations setting added.',
			'Codebase improved.',
			'material-ui updated to v4.9.1',
			'All dependency packages updated.'
		],
		fixedChanges: [
			'Mutation fixed on route settings.',
			'Circular Dependency issues.',
			'RTL FuseScrollbars issue solved.'
		],
		breakingChanges: [
			<span key="bundle-size-opt">
				Bundle Size optimizations: top level imports changed with path imports:
				<a
					href="https://material-ui.com/guides/minimizing-bundle-size/#how-to-reduce-the-bundle-size"
					target="_blank"
					rel="noopener noreferrer"
				>
					#how-to-reduce-the-bundle-size
				</a>
			</span>,
			'@fuse directories re-structured (@fuse/components > @fuse/core etc.), top level imports removed from @fuse/index, import paths updated.',
			'All Import paths re-ordered.',
			'All project reformated with the eslint, prettier configuration',
			'jss-extend changed with jss-plugin-extend',
			'webpack-bundle-analyzer changed with source-map-explorer'
		]
	},
	{
		version: '3.4.0',
		date: '2020-01-16',
		newChanges: [
			'RTL language support added.',
			'Multi language support added.',
			'All dependency packages updated.',
			'Allow everyone(guest,user) for accessing root (/) page as a landing page while whole app auth protected.',
			'"redirect the logged-in user to a specific route depending on his role" title added into the FuseAuthorization Doc.'
		],
		fixedChanges: [
			"react-scripts reverted back to v3.2.0 : v3.3.0 doesn't work in development mode on IE or edge",
			'Scrumboard App: Board list header menu not working.',
			'Chat Panel: Toggle Button not working on mobile; ClickAwayListener changed with custom event handler.'
		]
	},
	{
		version: '3.3.0',
		date: '2019-12-17',
		newChanges: [
			'material-ui updated to v4.8.0',
			'Default theme scheme changed.',
			'All dependency packages updated.'
		],
		fixedChanges: [
			'E-Commerce App: reset table page when listing search results.',
			"Project Dashboard: 'scales.[x/y]Axes.categoryPercentage' is deprecated changed with 'dataset.categoryPercentage'"
		]
	},
	{
		version: '3.2.5',
		date: '2019-11-20',
		newChanges: ['material-ui updated to v4.6.1', 'react updated to v16.12.0', 'All dependency packages updated.'],
		fixedChanges: ['FusePage layout components: Drawer closes whenever click on it.']
	},
	{
		version: '3.2.4',
		date: '2019-10-24',
		newChanges: [
			'material-ui updated to v4.5.1',
			'react updated to 16.11.0',
			'All dependency packages updated.',
			'@fake-db/mock.js).',
			'E-Commerce App, shows FuseLoading component while product data is loading.',
			'Contacts App Contact Dialog Mobile refinement for scroll.',
			'Calendar App Native date input changed with DateTimePicker.',
			'FuseNavigation, dense attr added for densed variation.'
		],
		fixedChanges: [
			'NavbarMobileToggleFab Button added for to display absence of the toolbar.',
			<span key="react-select-fix">
				react-select returns null despite of empty array, workaround applied for FuseChipSelect.
				<a
					href="https://github.com/intljusticemission/react-big-calendar/issues/1387#issuecomment-531465438"
					target="_blank"
					rel="noopener noreferrer"
				>
					the related issue
				</a>
			</span>,
			'Fix for Safari: Contacts App column filter input text is not visible.',
			'Fix for Firefox: ScrumboardApp scroll issue.',
			'suppressScrollX for the navigation at layout-1 for to fix showing horizontal scroll while fold.',
			'Calendar App New Event, moment js deprecation warning - Not in a recognized ISO format',
			<span key="calendar-drag-drop-fix">
				Calendar App drag drop fix:
				<a
					href="https://github.com/JedWatson/react-select/issues/3632"
					target="_blank"
					rel="noopener noreferrer"
				>
					the related issue
				</a>
			</span>
		]
	},
	{
		version: '3.2.3',
		date: '2019-09-09',
		newChanges: [
			'material-ui updated to v4.4.1',
			'react updated to 16.9.0',
			'All dependency packages updated.',
			'FuseChipSelectFormsy Component added.',
			'Default FuseSuspense loading delay changed to 0.'
		],
		fixedChanges: ['FuseHorizontalNav items minor theming issues.', 'Minor fixes for dependency updates.']
	},
	{
		version: '3.2.2',
		date: '2019-08-09',
		newChanges: [
			'withRouterAndRef hoc added for use forwardRef with withRouter.',
			'scrollToTopOnRouteChange added to FuseScrollbars.',
			<span key="nested-object-support">
				Nested Object support added for useForm hook. <br />
				(use with attribute <code>{`name="profile.username" value={form.profile.username}`}</code>)
			</span>
		],
		fixedChanges: [
			'scrollToTopOnChildChange changed with scrollToTopOnRouteChange in FusePageCarded.',
			'Route component theme settings do not applied if the route is the entry path of the app.'
		]
	},
	{
		version: '3.2.1',
		date: '2019-08-08',
		newChanges: [
			'material-ui updated to v4.3.1',
			'tailwind config updated.',
			'All dependency packages updated.',
			'Some import paths optimized.',
			'HorizontalNavigation active highlighting added for group and collapse navigation items.'
		],
		fixedChanges: [
			'FuseLayout do not hold render until settings at the redux state is updated. This causes multiple mount of the route component which has different layout settings.',
			'Layout style issues due to browser updates.',
			'Removal of event listeners in FuseScrollbars (@stephankaag).'
		]
	},
	{
		version: '3.2.0',
		date: '2019-07-31',
		newChanges: ['material-ui updated to v4.3.0', 'tailwind config updated.', 'All dependency packages updated.'],
		fixedChanges: [
			'Academy App is not scroll correctly when the theme footer is static.',
			'Scrumboard App list name form not works.'
		],
		breakingChanges: [
			'tailwindcss colors matched with material colors (shade values changed with hues for example: .bg-red-dark to .bg-red-700)'
		]
	},
	{
		version: '3.1.0',
		date: '2019-06-27',
		newChanges: [
			'material-ui updated to v4.1.3',
			'react-big-calendar updated to v0.22.0',
			'Await render while auto re-login on refresh or revisit of the authenticated user. It also solves extra redirection.',
			'All dependency packages updated.'
		]
	},
	{
		version: '3.0.1',
		date: '2019-06-18',
		newChanges: [
			'material-ui updated to v4.1.1',
			'react-redux updated to v7.1.0',
			'react-router updated to v5.0.1',
			'tailwindcss updated to v1.0.4',
			'All dependency packages updated.'
		]
	},
	{
		version: '3.0.0',
		date: '2019-06-02',
		newChanges: [
			<span key="hooks-intro">
				All of the code migrated to
				<a
					href="https://reactjs.org/docs/hooks-intro.html"
					target="_blank"
					rel="noopener noreferrer"
				>
					the hooks
				</a>
				(New feature of react let you use state and other React features without writing a class.)
			</span>,
			'material-ui updated to v4',
			'react-scripts updated to v3',
			'react-redux updated to v7.1 (for hooks support)',
			'tailwindcss updated to v1.0.2',
			<span key="user-role-array">
				user.role can be array to assign multiple permission roles. For details checkout
				<a
					href="http://react-material.fusetheme.com/documentation/fuse-components/fuse-authorization"
					target="_blank"
					rel="noopener noreferrer"
				>
					FuseAuthorization Docs
				</a>
				.
			</span>,
			'All dependency packages updated.',
			'Codebase improved.'
		],
		fixedChanges: [
			<span key="ie-polyfill">
				<i>"createBrowserHistroy is not exported from history.tsx"</i> error on windows environment(rare)
			</span>
		],
		breakingChanges: [
			<span key="react-loadable">
				react-loadable changed with React.suspense, React.lazy. All route configs updated with React.lazy
			</span>,
			'classNames() replaced with clsx().',
			<span key="ie-support">
				We have no longer support Internet Explorer by default. If you still need it, you can install
				<a
					href="https://github.com/facebook/create-react-app/tree/master/packages/react-app-polyfill"
					target="_blank"
					rel="noopener noreferrer"
				>
					react-app-polyfill
				</a>
				for to support.
			</span>
		],
		notes: (
			<Typography
				className="mt-4 w-full max-w-2xl rounded-xl border-2 p-3 text-base"
				component="div"
			>
				Migrating to the new major version (<b>v3.0.0</b>) can be difficult because of the hooks support and
				major dependency releases.
			</Typography>
		)
	},
	{
		version: '2.2.5',
		date: '2019-03-25',
		newChanges: [
			'Dependency packages updated (react v16.8.5, react-router v5 etc).',
			'Mail, Todo apps route configs updated.',
			'Changelog page design updated.'
		],
		fixedChanges: ['Minor text color refinement.']
	},
	{
		version: '2.2.4',
		date: '2019-03-06',
		newChanges: ['Dependency packages updated (react v16.8.4 etc).', 'setRef prop added to FuseAnimate.'],
		fixedChanges: [
			'Whitelist added to purgecss config for to prevent removing dynamically created navigation classes.',
			'Layout issues on safari <= v10'
		]
	},
	{
		version: '2.2.3',
		date: '2019-02-27',
		newChanges: [
			'Dependency packages updated (react v16.8.3 etc).',
			'purgecss added to decrease file size of the production build.'
		],
		fixedChanges: [
			'Fuse vertical navigation collapse items don’t have to be collapsed whenever navigation updated or location path changed.'
		],
		breakingChanges: [
			'src/styles/fuse-helpers.css renamed with src/styles/tailwind.css',
			'src/styles/fuse-helpers.tailwind.css renamed with src/styles/tailwind.base.css'
		]
	},
	{
		version: '2.2.2',
		date: '2019-02-18',
		newChanges: ['Dependency packages updated (react v16.8.1, react-scripts etc).', 'PSD files updated.'],
		fixedChanges: [
			'Rendering Dom in "window.onload" function to wait all files loaded (esp css files).',
			'Theming issues (FuseCountdown, tables of Invoice pages).'
		]
	},
	{
		version: '2.2.1',
		date: '2019-02-11',
		newChanges: [
			'Dependency packages updated (react, material-ui etc).',
			'FuseNavigation update,remove,append,prepend actions created, documentation page is updated.',
			'react-chartjs-2-defaults.js file created.'
		],
		fixedChanges: [
			'react, react-dom are added to resolutions to prevent loading two versions of the react. +\n' +
				"the issue's main reason is auth0-lock uses react as dependency not peerDependency and they don't change it with kinda valid reason\n" +
				'(https://github.com/auth0/lock/issues/1148#issuecomment-336765301).',
			'Calendar App Header updating issue fixed.'
		]
	},
	{
		version: '2.2.0',
		date: '2019-02-03',
		newChanges: [
			'Project Dashboard App added.',
			"External Link Item added to FuseNavigation (type:'link').",
			'"metecons" extra icon fonts added.',
			'Dependency packages updated.'
		]
	},
	{
		version: '2.1.0',
		date: '2019-01-22',
		newChanges: ['Notes App Added.', 'Dependency packages updated.'],
		fixedChanges: [
			"dir-glob error is fixed with globby 8.0.2 via locking it's version. (This error only occurs when you use npm to install node_modules instead of yarn).",
			'FuseSearch did not hide auth protected navigation items.'
		]
	},
	{
		version: '2.0.0',
		date: '2019-01-11',
		newChanges: [
			'New theme layout added (layout-3)',
			'Container layout mode created for layout-2 and layout-3."container" class added to relevant places.',
			'FuseSidePanel created and used in layout-3.',
			'FuseNavigation: dense variant added for horizontal layout only.',
			'FuseShortcuts: vertical variant added.',
			'FuseSearch: basic variant added (checkout layout-3)',
			'dark-material-bg.jpg changed to gradient background.',
			'HeroiconsUI page refined.',
			'Generating source map disabled by default on production build.',
			'Navigation data refactored on the demo.',
			'Documentation updated.',
			'Dependency packages updated.'
		],
		fixedChanges: [
			'Codebase improvements.',
			'Some IE fixes.',
			'FuseAuthorization must have state to prevent restricted route component mount when unauthorized user redirects.',
			"E-Commerce App, navigating product to new product didn't update the form state.",
			'Authentication timing issues fixed.'
		],
		breakingChanges: [
			'Theme layouts moved out of the @fuse core files which gives developers to create or edit theme layouts easily.',
			'Project structure changed after new layout system.',
			'Theme configuration state moved from FuseTheme to redux store (fuse.settings).'
		],
		notes: (
			<Typography
				className="mt-4 w-full max-w-2xl rounded-xl border-2 p-3 text-base"
				component="div"
			>
				Migrating to the new major version (v2.0.0) can be difficult because of the project structure and layout
				system changes.
			</Typography>
		)
	},
	{
		version: '1.2.8',
		date: '2018-11-28',
		newChanges: [
			'Academy App added.',
			'FuseSearch Component added (located at the main toolbar and searches in the navigation).',
			'FuseChipSelect documentation page added.',
			'Dependency packages updated (Material-ui etc).'
		],
		fixedChanges: [
			'Missing input variants added to Formsy Higher Order Components.',
			'FuseChipSelect variant styles fixed.',
			'FuseNavHorizontalItem missing exact prop added.',
			"E-Commerce App, navigating product to new product didn't update the form state.",
			'Authentication timing issues fixed.'
		]
	},
	{
		version: '1.2.7',
		date: '2018-11-18',
		newChanges: [
			'JWT support added to Regular Authentication.',
			'FuseMessage variations added (error, success, alert, info).',
			'Dependency packages updated (Material-ui etc).'
		],
		fixedChanges: [
			'FuseMessage relocated (position changed absolute to fixed).',
			'Hide navbar button when navbar display set to false on mobile.',
			'Layout-1 folded navigation mobile fix.',
			'react-router-config react-router-dom versions matched.',
			'tabs style fix for tabbed page layouts.'
		]
	},
	{
		version: '1.2.6',
		date: '2018-11-07',
		fixedChanges: ['Theme Layout-1 Mobile fix (!important)']
	},
	{
		version: '1.2.5',
		date: '2018-11-06',
		newChanges: [
			'FuseDialog Component added to theme layout for easily show dialog messages via redux action.',
			'Dependency packages updated (Material-ui, react-redux etc).'
		],
		fixedChanges: ['Layout-1 folded navigation broken in macOS safari browser.']
	},
	{
		version: '1.2.4',
		date: '2018-10-26',
		newChanges: ['Dependency packages updated (React, Material-ui etc).']
	},
	{
		version: '1.2.3',
		date: '2018-10-14',
		newChanges: ['Dependency packages updated (Redux etc).', 'Redux developer tools disabled on production.'],
		fixedChanges: ['Redux Developer Tools Extension fix: problem occurs if the extension is enabled on Firefox.']
	},
	{
		version: '1.2.2',
		date: '2018-10-09',
		newChanges: [
			'Initial loading time reduced with code splitting (lazy loading) components and also reducers.',
			'redux-loadable library added.',
			'FuseLoadable component created for to avoid repetition.',
			'webpack-bundle-analyzer package added to devDependencies for to analyze build.',
			'Material UI updated to v3.2.0.',
			'Dependency packages updated.'
		]
	},
	{
		version: '1.2.1',
		date: '2018-10-04',
		newChanges: [
			'create-react-app updated to v2',
			'Material UI updated to v3.1.2',
			'Navigation active item style option added for to use square highlighting(old style).',
			'Dependency packages updated.',
			'E-commerce App data/assets updated.'
		],
		fixedChanges: [
			'Synthetically trigger event onChange for higher-order components of formsy.',
			'Edge, Ie font icon ligature fix.'
		]
	},
	{
		version: '1.2.0',
		date: '2018-09-25',
		newChanges: [
			"The design is modernized with Google Material Design's new specs. + Icons replaced with outlined material icons, + Main Font Family changed to Muli",
			'Scrumboard App added.',
			'Material UI updated to v3.1.1',
			'FuseChipSelect: "variant" attr added for to choose creatable or fixed multi selection.',
			'Dependency packages updated.',
			"@lodash path created to use lodash's mixins.",
			'Webkit scrollbar styles added.',
			'Auth Services(Auth0, Firebase) are revised for to easily disable.',
			'Various mobile device refinements applied.'
		],
		fixedChanges: ['Cleaner approach for Mail App.']
	},
	{
		version: '1.1.8',
		date: '2018-09-08',
		newChanges: [
			'E-commerce App added.',
			'FuseChipSelect Component added.',
			'Material UI updated to v3.0.2',
			'Dependency packages updated.'
		]
	},
	{
		version: '1.1.7',
		date: '2018-08-27',
		newChanges: [
			'FuseSplashScreen added.',
			<span key="firebase-auth">
				<b>firebaseService</b> and <b>auth0Service</b> created, <b>Auth</b> component added as entry point for
				authentication.
			</span>,
			'Login, register pages updated due to adding Auth0 authentication.',
			'404 page redirection added to the routes.',
			'Material UI updated to v1.5.1',
			'Dependency packages updated.'
		],
		breakingChanges: ['FirebaseAuth Component removed, using Auth component instead.']
	},
	{
		version: '1.1.6',
		date: '2018-08-12',
		newChanges: ['Chat App added.', 'Material UI updated to v1.4.3', 'Dependency packages updated.']
	},
	{
		version: '1.1.5',
		date: '2018-07-18',
		newChanges: [
			'Chat Panel added.',
			'LeftSidePanel RightSidePanel Layout areas added.',
			'Navbar style refined.',
			'Material UI updated to v1.4.0',
			'Other Dependency packages updated.'
		]
	},
	{
		version: '1.1.4',
		date: '2018-07-09',
		newChanges: ['Todo App added.', 'Material UI updated to v1.3.1', 'Other Dependency packages updated.']
	},
	{
		version: '1.1.3',
		date: '2018-06-28',
		newChanges: ['Material UI updated to v1.3.0', 'Dependency packages updated.']
	},
	{
		version: '1.1.2',
		date: '2018-06-18',
		newChanges: ['Changing default settings with route params.', 'Dependency packages updated.'],
		fixedChanges: [
			'FuseAnimate, FuseAnimateGroup inject error.',
			'Folded Navigation extra space fixed between 960px and 1280px of window width.'
		]
	},
	{
		version: '1.1.1',
		date: '2018-06-10',
		newChanges: [
			<span key="velocity-react">
				<code>velocity-react</code> added as dependency, its used for fuseAnimation
			</span>,
			<span key="fuse-animation">
				<code>FuseAnimation</code> <code>FuseAnimationGroup</code> created for easily animate components and
				applied most of the pages.
			</span>,
			<span key="exact-prop">
				<code>exact</code> property option added to navigation item for matching location exactly.
			</span>,
			'Dependency packages updated.'
		]
	},
	{
		version: '1.1.0',
		date: '2018-06-06',
		newChanges: [
			'Layout system enhanced.',
			'New Horizontal Layout added (layout-2).',
			<span key="react-poper">
				<code>react-poper</code> added as dependency, its used for horizontal navigation
			</span>,
			<span key="material-ui-update">
				<code>Material UI</code> updated to v1.2.0
			</span>,
			'Dependency packages updated.'
		],
		fixedChanges: [
			'Dialog form of Contacts App and Calendar App fixed due to React 16.4.0 bugfix for getDeriveredStateFromProps',
			'(https://reactjs.org/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops).',
			'Actions and reducers of fuse navigation fixed.'
		],
		breakingChanges: [
			'Layout and Theme settings data structure changed.',
			'If you are storing the user data at database, old saved user settings will not work with this version.',
			'Page Layouts default scroll behaviour changed to singleScroll due to new layout mechanism, additional innerScroll attribute also added.',
			'FuseSettings separated from the settings panel.'
		]
	},
	{
		version: '1.0.5',
		date: '2018-05-29',
		newChanges: [
			<span key="material-ui-update">
				<code>Material UI</code> updated to v1.1.0
			</span>,
			'Dependency packages updated.'
		],
		fixedChanges: [
			'Extra control added if user.data exist in Firebase Db',
			'Navigation Collapse fixed due to React 16.4.0 bugfix for getDeriveredStateFromProps',
			'(https://reactjs.org/blog/2018/05/23/react-v-16-4.html#bugfix-for-getderivedstatefromprops).'
		]
	},
	{
		version: '1.0.4',
		date: '2018-05-22',
		newChanges: [
			<span key="material-ui-update">
				<code>Material UI</code> updated to v1.0.0
			</span>,
			'Firebase integration added as an example for authentication (Also saves user data to firebase/db).',
			'Register Page Created for Firebase.',
			'FuseMessage Component added to theme layout for easily show snackbar messages via redux action.'
		],
		breakingChanges: [
			<span key="fuse-auth">
				<code>FuseAuth</code> renamed with FuseAuthorization
			</span>,
			'Shortcuts data storage moved under the user.data.'
		]
	},
	{
		version: '1.0.3',
		date: '2018-05-16',
		newChanges: [
			<span key="material-ui-update">
				<code>Material UI</code> updated to v1.0.0-rc.0
			</span>,
			<span key="material-ui-update">
				<a
					href="https://github.com/mui-org/material-ui/releases/tag/v1.0.0-rc.0"
					target="_blank"
					rel="noopener noreferrer"
				>
					Checkout the breaking changes
				</a>
			</span>,
			<span key="google-map">
				<code>google-map-react</code> updated.
			</span>
		]
	},
	{
		version: '1.0.2',
		date: '2018-05-12',
		fixedChanges: [
			'Tailwind error on windows.',
			<span key="env-files">
				missing <code>.env</code> <code>.babelrc</code> files added.
			</span>
		]
	},
	{
		version: '1.0.1',
		date: '2018-05-10',
		newChanges: ['All dependencies updated.'],
		fixedChanges: [
			<span key="cross-env">
				<code>cross-env</code> library added for absolute path across platforms.
			</span>
		]
	},
	{
		version: '1.0.0',
		date: '2018-04-21',
		notes: (
			<ul className="mt-6 pl-6">
				<li>
					<Typography>Initial Release</Typography>
				</li>
			</ul>
		)
	}
];

export default changelogData;
