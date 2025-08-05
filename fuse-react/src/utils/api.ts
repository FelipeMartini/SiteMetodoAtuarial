import ky, { KyInstance } from 'ky';

const apiUrl = new URL((import.meta?.env?.VITE_API_BASE_URL as string) || 'http://localhost:3000');
const devApiBaseHost = apiUrl.hostname;
const PORT = Number(import.meta.env.VITE_PORT) || 3000;
const devApiBaseUrl = `${apiUrl.protocol}//${devApiBaseHost}:${PORT}`;

export const API_BASE_URL = import.meta.env.DEV ? devApiBaseUrl : (import.meta.env.VITE_API_BASE_URL as string) || '/';

let globalHeaders: Record<string, string> = {};

export const api: KyInstance = ky.create({
	prefixUrl: `${API_BASE_URL}/api`,
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

export const setGlobalHeaders = (headers: Record<string, string>) => {
	globalHeaders = { ...globalHeaders, ...headers };
};

export const removeGlobalHeaders = (headerKeys: string[]) => {
	headerKeys.forEach((key) => {
		delete globalHeaders[key];
	});
};

export const getGlobalHeaders = () => {
	return globalHeaders;
};

export default api;
