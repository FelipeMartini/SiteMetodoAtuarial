// src/app/(control-panel)/apps/ai-image-generator/api/types.ts
export type AiImageGenSettings = {
	prompt?: string;
	negativePrompt?: string;
	size?: string;
	artStyle?: string;
	style?: string;
	mood?: string;
	lighting?: string;
	quality?: string;
};

export type AiImageGenPreset = {
	id?: string;
	name?: string;
	settings?: AiImageGenSettings;
	createdAt?: number;
};

export type AiImageGenApiResponse = {
	created?: number;
	data?: {
		revised_prompt?: string;
		url?: string;
	}[];
};

export type AiImageGenItem = {
	id?: string;
	favorite?: boolean;
	formData?: AiImageGenSettings;
	response?: AiImageGenApiResponse;
	sourceImageUrl?: string;
};
