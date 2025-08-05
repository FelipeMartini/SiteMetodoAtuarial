import Typography from '@mui/material/Typography';
import FuseHighlight from '@fuse/core/FuseHighlight';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';

/**
 * Directory Structure Doc
 * Developer guide for organizing app features with consistent folder structure
 */
function DirectoryStructureDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				Directory Structure
			</Typography>

			<Typography
				className="mb-6"
				component="p"
			>
				This guide helps you organize your app features consistently. Every feature should follow this structure
				for maintainable and scalable development.
			</Typography>

			{/* Core Structure */}
			<Paper className="mb-6 p-6">
				<Typography
					variant="h5"
					className="mb-4 font-semibold"
				>
					Core Structure
				</Typography>
				<Box className="mb-4 flex flex-wrap gap-2">
					<Chip label="api/" />
					<Chip label="components/" />
					<Chip label="route.tsx" />
				</Box>
				<ul className="list-inside list-disc space-y-2">
					<li>
						<code>api/</code> → All API concerns (hooks, services, types, models)
					</li>
					<li>
						<code>components/</code> → UI components (ui/, views/, forms/)
					</li>
					<li>
						<code>route.tsx</code> → React Router route configuration
					</li>
				</ul>
			</Paper>

			{/* Optional Structure */}
			<Paper className="mb-6 p-6">
				<Typography
					variant="h5"
					className="mb-4 font-semibold"
				>
					Optional Structure (Create As Needed)
				</Typography>
				<Box className="mb-4 flex flex-wrap gap-2">
					<Chip label="contexts/" />
					<Chip label="hooks/" />
					<Chip label="lib/" />
					<Chip label="types/" />
				</Box>
				<ul className="list-inside list-disc space-y-2">
					<li>
						<code>contexts/</code> → React contexts (grouped by feature)
					</li>
					<li>
						<code>hooks/</code> → General React hooks (non-API hooks)
					</li>
					<li>
						<code>lib/</code> → Utilities and constants (when substantial)
					</li>
					<li>
						<code>types/</code> → Frontend-specific types (when separate from API types)
					</li>
				</ul>
			</Paper>

			{/* Decision Tree */}
			<Typography
				variant="h5"
				className="mb-4 font-semibold"
			>
				File Placement Decision Tree
			</Typography>
			<Typography
				className="mb-4"
				component="p"
			>
				When creating a new file, ask yourself these questions in order:
			</Typography>
			<Paper className="mb-6 bg-gray-50 p-4">
				<ol className="list-inside list-decimal space-y-2">
					<li>
						<strong>API-related?</strong> → <code>api/</code> (always create this folder)
					</li>
					<li>
						<strong>UI Component?</strong> → <code>components/</code> (always create this folder)
					</li>
					<li>
						<strong>React Router route?</strong> → <code>route.tsx</code> (always create this route file)
					</li>
					<li>
						<strong>React context?</strong> → <code>contexts/</code>
					</li>
					<li>
						<strong>Custom hook?</strong> → <code>hooks/</code>
					</li>
					<li>
						<strong>Utility function?</strong> → <code>lib/</code> (create if utilities are substantial)
					</li>
					<li>
						<strong>Frontend type?</strong> → <code>types/</code> (create if types are complex)
					</li>
				</ol>
			</Paper>

			{/* API Directory Details */}
			<Typography
				variant="h5"
				className="mb-4 font-semibold"
			>
				API Directory Structure
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-bash mb-6"
			>
				{`api/
├── hooks/          → TanStack Query hooks, data fetching
├── services/       → Raw API functions, HTTP clients  
├── types/          → API response types, request payloads
└── models/         → Data transformation, factory functions`}
			</FuseHighlight>

			{/* Components Directory Details */}
			<Typography
				variant="h5"
				className="mb-4 font-semibold"
			>
				Components Directory Structure
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-bash mb-6"
			>
				{`components/
├── views/          → Page-level components, main views
├── ui/             → Reusable UI components, design system
└── forms/          → Form components, input controls`}
			</FuseHighlight>

			{/* Examples */}
			<Typography
				variant="h5"
				className="mb-4 font-semibold"
			>
				Structure Examples
			</Typography>

			<Typography
				variant="h6"
				className="mb-3 font-medium"
			>
				✅ Full Feature Structure
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-bash mb-6"
			>
				{`contacts/
├── api/
│   ├── hooks/
│   │   ├── useContacts.ts
│   │   ├── useCreateContact.ts
│   │   └── useUpdateContact.ts
│   ├── services/
│   │   └── contactsApi.ts
│   ├── types/
│   │   └── index.ts
│   └── models/
│       └── ContactModel.ts
├── components/
│   ├── views/
│   │   └── ContactsView.tsx
│   ├── ui/
│   │   ├── ContactCard.tsx
│   │   └── ContactList.tsx
│   └── forms/
│       └── ContactForm.tsx
├── contexts/
│   └── ContactsContext/
│       ├── Context.ts
│       ├── Provider.tsx
│       └── useContactsContext.ts
├── hooks/
│   ├── useContactFilter.ts
│   └── useContactSearch.ts
└── route.tsx`}
			</FuseHighlight>

			<Typography
				variant="h6"
				className="mb-3 font-medium"
			>
				⚠️ Minimal Structure (Also Acceptable)
			</Typography>
			<FuseHighlight
				component="pre"
				className="language-bash mb-6"
			>
				{`simple-feature/
├── api/
│   └── simpleApi.ts
├── components/
│   └── SimpleView.tsx
└── route.tsx`}
			</FuseHighlight>

			{/* Best Practices */}
			<Paper className="mb-6 p-4">
				<Typography
					variant="h6"
					className="mb-3 font-semibold"
				>
					💡 Best Practices
				</Typography>
				<ul className="list-inside list-disc space-y-2">
					<li>Start simple - only create folders when you need them</li>
					<li>Don't create empty directories just to follow the structure</li>
					<li>Group related functionality together within each directory</li>
					<li>Use consistent naming conventions across your features</li>
					<li>Consider the maintenance burden - simpler is often better</li>
					<li>Follow this structure for consistent app development</li>
				</ul>
			</Paper>

			<Typography
				className="mb-4"
				component="p"
			>
				This structure adapts to your feature's complexity while maintaining consistency across your
				application. Focus on making your code easy to find and understand rather than following every guideline
				perfectly.
			</Typography>
		</>
	);
}

export default DirectoryStructureDoc;
