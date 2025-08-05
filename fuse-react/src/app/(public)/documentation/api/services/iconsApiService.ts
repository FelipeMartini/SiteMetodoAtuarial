import { api } from '@/utils/api';

export const iconsApiService = {
	getIcons: async (url: string): Promise<string[]> => {
		return await api.get(url).json();
	}
};
