import { StyleOption } from '../../components/forms/generator-form/controllers/StyleSelectFormController';

const lightingPresets: StyleOption[] = [
	{
		value: 'natural',
		label: 'Natural Lighting',
		image: '/assets/images/apps/ai-image-generator/lighting/natural.webp',
		description: 'Soft, balanced daylight illumination',
		color: '#7d6246'
	},
	{
		value: 'studio',
		label: 'Studio Lighting',
		image: '/assets/images/apps/ai-image-generator/lighting/studio.webp',
		description: 'Professional controlled lighting setup',
		color: '#FFFFFF'
	},
	{
		value: 'golden_hour',
		label: 'Golden Hour',
		image: '/assets/images/apps/ai-image-generator/lighting/golden_hour.webp',
		description: 'Warm, soft, directional light with long shadows from a low sun',
		color: '#6d3420'
	},
	{
		value: 'neon_glow',
		label: 'Neon Glow',
		image: '/assets/images/apps/ai-image-generator/lighting/neon_glow.webp',
		description: 'Vivid neon lights casting colorful glows for urban or futuristic scenes',
		color: '#00E5FF'
	},
	{
		value: 'soft_ambient',
		label: 'Soft Ambient',
		image: '/assets/images/apps/ai-image-generator/lighting/soft_ambient.webp',
		description: 'Gentle, diffused lighting with minimal shadows, creating a dreamy look',
		color: '#b29f8d'
	},
	{
		value: 'backlit',
		label: 'Backlit',
		image: '/assets/images/apps/ai-image-generator/lighting/backlit.webp',
		description: 'Light source positioned behind the subject, creating a silhouette effect',
		color: '#0b0a0a'
	},
	{
		value: 'low_key',
		label: 'Low-Key Lighting',
		image: '/assets/images/apps/ai-image-generator/lighting/low_key.webp',
		description: 'Strong contrast and dark tones, emphasizing shadows and form',
		color: '#2C2C2C'
	},
	{
		value: 'spotlight',
		label: 'Spotlight',
		image: '/assets/images/apps/ai-image-generator/lighting/spotlight.webp',
		description: 'Dramatic illumination with the subject brightly lit against a darker background',
		color: '#140d14'
	},
	{
		value: 'candlelight',
		label: 'Candlelight',
		image: '/assets/images/apps/ai-image-generator/lighting/candlelight.webp',
		description: 'Warm, flickering candlelight creating a cozy or historical atmosphere',
		color: '#FFB74D'
	},
	{
		value: 'overcast',
		label: 'Overcast',
		image: '/assets/images/apps/ai-image-generator/lighting/overcast.webp',
		description: 'Soft, muted lighting under a cloudy sky, reducing shadows for a neutral tone',
		color: '#A0A4A8'
	},
	{
		value: 'bioluminescent_glow',
		label: 'Bioluminescent Glow',
		image: '/assets/images/apps/ai-image-generator/lighting/bioluminescent_glow.webp',
		description: 'A natural, soft glow from bioluminescent flora or fauna, creating a magical ambiance',
		color: '#2e5964'
	}
];

export default lightingPresets;
