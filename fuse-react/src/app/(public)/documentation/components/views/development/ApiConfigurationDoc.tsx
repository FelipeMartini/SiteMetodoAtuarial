import Typography from '@mui/material/Typography';
import FuseHighlight from '@fuse/core/FuseHighlight';
import TitleReferenceLink from 'src/components/TitleReferenceLink';

/**
 * Api Configuration Doc
 * This document provides information on how to configure the API using MSW and ky.
 */
function ApiConfigurationDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-10 font-bold"
			>
				API Configuration
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				This document explains how to configure and use API routes in the Fuse React Vite.js project with Mock
				Service Worker (MSW) and the ky HTTP client.
			</Typography>

			<Typography
				className="mt-6 mb-2.5"
				variant="h6"
			>
				MSW Configuration <TitleReferenceLink id="msw-configuration" />
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				MSW is employed to intercept and simulate API requests during the development and testing phases. This
				approach significantly accelerates the development and testing processes of the API.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				MSW is configured in the `index.tsx` file:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-typescript"
			>
				{`
import { worker } from '@mock-utils/mswMockAdapter';
import { API_BASE_URL } from '@/utils/api';

async function mockSetup() {
	return worker.start({
		onUnhandledRequest: 'bypass',
		serviceWorker: {
			url: \`\${API_BASE_URL}/mockServiceWorker.js\`
		}
	});
}

mockSetup().then(() => {
	// Application initialization code
});
				`}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				This setup ensures that MSW intercepts API requests, and allowing mocking api requests across the
				application before bootstrapping the application.
			</Typography>

			<Typography
				className="mt-6 mb-2.5"
				variant="h6"
			>
				Global API Configuration with ky <TitleReferenceLink id="api-configuration" />
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				`utils/api.ts` provides a configured instance of the ky HTTP client with global settings for all API
				requests. The API base URL is determined based on the environment:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-typescript"
			>
				{`
// src/utils/api.ts
import ky, { KyInstance } from 'ky';

const apiUrl = new URL((import.meta?.env?.VITE_API_BASE_URL as string) || 'http://localhost:3000');
const devApiBaseHost = apiUrl.hostname;
const PORT = Number(import.meta.env.VITE_PORT) || 3000;
const devApiBaseUrl = \`\${apiUrl.protocol}//\${devApiBaseHost}:\${PORT}\`;

export const API_BASE_URL = import.meta.env.DEV ? devApiBaseUrl : (import.meta.env.VITE_API_BASE_URL as string) || '/';

let globalHeaders: Record<string, string> = {};

export const api: KyInstance = ky.create({
	prefixUrl: \`\${API_BASE_URL}/api\`,
	hooks: {
		beforeRequest: [
			(request) => {
				Object.entries(globalHeaders).forEach(([key, value]) => {
					request.headers.set(key, value);
				});
			}
		]
	},
	retry: {
		limit: 2,
		methods: ['get', 'put', 'head', 'delete', 'options', 'trace']
	}
});
				`}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				This configuration creates a ky instance with the following features:
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				- Dynamic API base URL that adapts to development or production environments
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				- Automatic prefixing of all requests with the API base URL and `/api` path
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				- Global headers that can be applied to all requests
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				- Automatic retry for certain HTTP methods (up to 2 retries)
			</Typography>

			<Typography
				className="mt-6 mb-2.5"
				variant="h6"
			>
				Managing Global Headers <TitleReferenceLink id="global-headers" />
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				The API utility provides functions to manage global headers across all API requests:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-typescript"
			>
				{`
// Add or update global headers
export const setGlobalHeaders = (headers: Record<string, string>) => {
	globalHeaders = { ...globalHeaders, ...headers };
};

// Remove specific global headers
export const removeGlobalHeaders = (headerKeys: string[]) => {
	headerKeys.forEach((key) => {
		delete globalHeaders[key];
	});
};

// Get all current global headers
export const getGlobalHeaders = () => {
	return globalHeaders;
};
				`}
			</FuseHighlight>

			<Typography
				className="mb-4"
				component="p"
			>
				These functions allow you to dynamically manage authentication tokens, content types, and other headers
				that should be included in all API requests.
			</Typography>

			<Typography
				className="mt-6 mb-2.5"
				variant="h6"
			>
				Environment Configuration <TitleReferenceLink id="environment-config" />
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				Ensure you have a `.env` file in your project root with the following variables:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-bash"
			>
				{`
# API base URL (required for production)
VITE_API_BASE_URL=https://your-api-domain.com

# Optional port for development server
VITE_PORT=3000
				`}
			</FuseHighlight>

			<Typography
				className="mt-6 mb-2.5"
				variant="h6"
			>
				Benefits of Using Mock Service Worker (MSW) <TitleReferenceLink id="msw-benefits" />
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				- Environment Agnostic: MSW works well in both development and production builds, making it easy to
				switch between mocked and real APIs.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				- Easy to Use: MSW provides a simple and intuitive API for mocking API requests, making it easy to set
				up and maintain.
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				- Improved Development Workflow: With MSW, you can develop and test your application without relying on
				a real API, leading to a more efficient development process.
			</Typography>

			<Typography
				className="mt-6 mb-2.5"
				variant="h6"
			>
				Connecting to a Real Database <TitleReferenceLink id="real-database-connection" />
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				To connect these API routes to a real database in a Vite.js project, you'll typically set up a backend
				server separately. Vite focuses on the frontend, so your backend would be a separate service (e.g.,
				Express.js, NestJS, or any other backend framework).
			</Typography>

			<Typography
				className="mb-4"
				component="p"
			>
				In production, you would configure your Vite app to send requests to your real API endpoint by setting
				the appropriate `VITE_API_BASE_URL` in your deployment environment.
			</Typography>
		</>
	);
}

export default ApiConfigurationDoc;
