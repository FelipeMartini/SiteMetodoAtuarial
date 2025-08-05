import { AiImageGenPreset } from '../../api/types';

export const examplePresets: AiImageGenPreset[] = [
	{
		id: '1',
		name: 'Mountain Lake Sunrise',
		settings: {
			prompt: 'A serene mountain lake at sunrise, reflecting snow-capped peaks',
			negativePrompt: 'people, buildings, boats, man-made structures',
			size: '1024x1024',
			artStyle: 'realistic',
			style: 'natural',
			mood: 'peaceful',
			lighting: 'golden_hour',
			quality: 'standard'
		},
		createdAt: 1709654400000
	},
	{
		id: '2',
		name: 'Cyberpunk Market',
		settings: {
			prompt: 'Cyberpunk street market with holographic advertisements and flying vehicles',
			negativePrompt: 'natural elements, daylight, historical buildings',
			size: '1024x1024',
			artStyle: 'cyberpunk',
			style: 'vivid',
			mood: 'mysterious',
			lighting: 'neon_glow',
			quality: 'hd'
		},
		createdAt: 1709568000000
	},
	{
		id: '3',
		name: 'Wizard Library',
		settings: {
			prompt: "Ancient wizard's library with floating books and magical artifacts",
			negativePrompt: 'modern technology, contemporary clothing',
			size: '1024x1024',
			artStyle: 'fantasy_art',
			style: 'natural',
			mood: 'mystical',
			lighting: 'candlelight',
			quality: 'standard'
		},

		createdAt: 1709481600000
	},
	{
		id: '4',
		name: 'Future Samurai',
		settings: {
			prompt: 'Futuristic samurai warrior in a cherry blossom garden',
			negativePrompt: 'guns, modern weapons, urban environment',
			size: '1024x1024',
			artStyle: 'anime',
			style: 'vivid',
			mood: 'dramatic',
			lighting: 'backlit',
			quality: 'hd'
		},

		createdAt: 1709395200000
	},
	{
		id: '5',
		name: 'Bioluminescent Reef',
		settings: {
			prompt: 'Underwater bioluminescent coral reef with exotic sea creatures',
			negativePrompt: 'humans, boats, pollution',
			size: '1024x1024',
			artStyle: 'digital_painting',
			style: 'natural',
			mood: 'ethereal',
			lighting: 'bioluminescent_glow',
			quality: 'hd'
		},

		createdAt: 1709308800000
	},
	{
		id: '6',
		name: 'Pixel Haunted House',
		settings: {
			prompt: '8-bit style haunted mansion at midnight',
			negativePrompt: 'realistic textures, smooth gradients',
			size: '1024x1024',
			artStyle: 'pixel_art',
			style: 'natural',
			mood: 'dark_fantasy',
			lighting: 'spotlight',
			quality: 'standard'
		},

		createdAt: 1709222400000
	},
	{
		id: '7',
		name: 'Autumn Waterfall',
		settings: {
			prompt: 'Misty forest waterfall in autumn colors',
			negativePrompt: 'people, buildings, vehicles',
			size: '1024x1024',
			artStyle: 'watercolor',
			style: 'natural',
			mood: 'serene',
			lighting: 'soft_ambient',
			quality: 'hd'
		},

		createdAt: 1709136000000
	},
	{
		id: '8',
		name: 'Superhero Battle',
		settings: {
			prompt: 'Superhero battle in a rain-soaked city',
			negativePrompt: 'daytime scenes, peaceful settings',
			size: '1024x1024',
			artStyle: 'comic_book',
			style: 'vivid',
			mood: 'heroic',
			lighting: 'low_key',
			quality: 'hd'
		},

		createdAt: 1709049600000
	},
	{
		id: '9',
		name: 'Space Portrait',
		settings: {
			prompt: 'Dreamy portrait of a girl with butterflies in space',
			negativePrompt: 'realistic backgrounds, earth-like settings',
			size: '1024x1024',
			artStyle: 'surrealism',
			style: 'natural',
			mood: 'romantic',
			lighting: 'studio',
			quality: 'standard'
		},

		createdAt: 1708963200000
	},
	{
		id: '10',
		name: 'Retro Arcade',
		settings: {
			prompt: 'Retro-style arcade with vintage gaming machines',
			negativePrompt: 'modern technology, outdoor scenes',
			size: '1024x1024',
			artStyle: 'pixel_art',
			style: 'natural',
			mood: 'nostalgic',
			lighting: 'neon_glow',
			quality: 'standard'
		},

		createdAt: 1708876800000
	},
	{
		id: '11',
		name: 'Western Showdown',
		settings: {
			prompt: 'Wild west showdown at high noon',
			negativePrompt: 'modern elements, urban settings',
			size: '1024x1024',
			artStyle: 'realistic',
			style: 'natural',
			mood: 'tense',
			lighting: 'natural',
			quality: 'hd'
		},

		createdAt: 1708790400000
	},
	{
		id: '12',
		name: 'Floating Islands',
		settings: {
			prompt: 'Floating islands with waterfalls in a sunset sky',
			negativePrompt: 'modern buildings, vehicles, people',
			size: '1024x1024',
			artStyle: 'fantasy_art',
			style: 'natural',
			mood: 'uplifting',
			lighting: 'golden_hour',
			quality: 'hd'
		},

		createdAt: 1708704000000
	}
];

export default examplePresets;
