import { StyleOption } from '../../components/forms/generator-form/controllers/StyleSelectFormController';

const artStylePresets: StyleOption[] = [
	{
		value: 'realistic',
		label: 'Realistic Photography',
		image: '/assets/images/apps/ai-image-generator/art-styles/realistic.webp',
		description: 'True-to-life photographic style with natural textures and lighting'
	},
	{
		value: 'anime',
		label: 'Anime Style',
		image: '/assets/images/apps/ai-image-generator/art-styles/anime.webp',
		description: 'Japanese animation inspired artwork with bold lines and vibrant colors'
	},
	{
		value: 'digital_painting',
		label: 'Digital Painting',
		image: '/assets/images/apps/ai-image-generator/art-styles/digital_painting.webp',
		description: 'Painterly look with soft brush strokes, resembling digital art programs'
	},
	{
		value: 'pixel_art',
		label: 'Pixel Art',
		image: '/assets/images/apps/ai-image-generator/art-styles/pixel_art.webp',
		description: 'Retro 8-bit or 16-bit style with a pixelated, grid-based look'
	},
	{
		value: 'watercolor',
		label: 'Watercolor Painting',
		image: '/assets/images/apps/ai-image-generator/art-styles/watercolor.webp',
		description: 'Soft and fluid brush strokes with translucent color blending'
	},
	{
		value: 'sketch',
		label: 'Sketch',
		image: '/assets/images/apps/ai-image-generator/art-styles/sketch.webp',
		description: 'Rough and hand-drawn pencil or charcoal look with visible linework'
	},
	{
		value: 'cyberpunk',
		label: 'Cyberpunk',
		image: '/assets/images/apps/ai-image-generator/art-styles/cyberpunk.webp',
		description: 'Futuristic style with neon colors, dark urban themes, and sci-fi elements'
	},
	{
		value: 'fantasy_art',
		label: 'Fantasy Art',
		image: '/assets/images/apps/ai-image-generator/art-styles/fantasy_art.webp',
		description: 'Imaginative scenes with mythical creatures, magical landscapes, and vibrant colors'
	},
	{
		value: 'surrealism',
		label: 'Surrealism',
		image: '/assets/images/apps/ai-image-generator/art-styles/surrealism.webp',
		description: 'Dreamlike, abstract style with unusual, mind-bending imagery'
	},
	{
		value: 'comic_book',
		label: 'Comic Book',
		image: '/assets/images/apps/ai-image-generator/art-styles/comic_book.webp',
		description: 'Bold lines, flat colors, and a pop-art feel inspired by comic strips'
	}
];

export default artStylePresets;
