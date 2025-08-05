import { api } from '@/utils/api';
import { AiImageGenPreset, AiImageGenItem } from '../types';

export const aiImageGenApi = {
	// Presets
	getPresets: async (): Promise<AiImageGenPreset[]> => {
		return api.get('mock/ai-image-generator/presets').json();
	},

	createPreset: async (preset: AiImageGenPreset): Promise<AiImageGenPreset> => {
		return api
			.post('mock/ai-image-generator/presets', {
				json: preset
			})
			.json();
	},

	deletePreset: async (id: string): Promise<void> => {
		await api.delete(`mock/ai-image-generator/presets/${id}`);
	},

	// Items
	getItems: async (): Promise<AiImageGenItem[]> => {
		return api.get('mock/ai-image-generator/items').json();
	},

	getItem: async (id: string): Promise<AiImageGenItem> => {
		return api.get(`mock/ai-image-generator/items/${id}`).json();
	},

	createItem: async (item: AiImageGenItem): Promise<AiImageGenItem> => {
		return api
			.post('mock/ai-image-generator/items', {
				json: item
			})
			.json();
	},

	updateItem: async (item: AiImageGenItem): Promise<AiImageGenItem> => {
		return api
			.put(`mock/ai-image-generator/items/${item.id}`, {
				json: item
			})
			.json();
	},

	deleteItem: async (id: string): Promise<void> => {
		await api.delete(`mock/ai-image-generator/items/${id}`);
	}
};
