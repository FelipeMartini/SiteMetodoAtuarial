import { AiImageGenItem } from '../../api/types';

const mockGeneratedImagesList: AiImageGenItem[] = [
	{
		id: '1',
		favorite: true,
		formData: {
			prompt: 'Cyberpunk street market with holographic advertisements and flying vehicles',
			negativePrompt: 'natural elements, daylight, historical buildings',
			size: '1024x1024',
			artStyle: 'cyberpunk',
			style: 'vivid',
			mood: 'mysterious',
			lighting: 'neon_glow',
			quality: 'hd'
		},
		response: {
			created: 1731149290,
			data: [
				{
					revised_prompt:
						"A cyberpunk-inspired setting where the juxtaposition of the modern and the futuristic comes alive. Envision a crowded street market under the dark velvet sky of an unknown city. Vendors of diverse ethnic backgrounds peddle their exotic wares under the harsh yet vibrant glow of intense neon lights. Illuminated holographic advertisements of brilliant hues dance above their heads, adding to the city's enigmatic atmosphere. Amidst this human chaos, flying vehicles zoom across the sky, their paths traced by streaks of light. Despite the overarching aura of mysterious intrigue, the scene is devoid of natural elements, daylight, and historical structures. All painted in the canvas of a futuristic art style with a wash of neon colors, dark urban themes, and sci-fi elements.",
					url: '/assets/images/apps/ai-image-generator/mock-storage/img-NHuvpWzGMHK0ijIJdZOejTU9.png'
				}
			]
		}
	},
	{
		id: '2',
		favorite: false,
		formData: {
			prompt: 'A serene mountain lake at sunrise, reflecting snow-capped peaks',
			negativePrompt: 'people, buildings, boats, man-made structures',
			size: '1024x1024',
			artStyle: 'realistic',
			style: 'natural',
			mood: 'peaceful',
			lighting: 'golden_hour',
			quality: 'standard'
		},
		response: {
			created: 1731149087,
			data: [
				{
					revised_prompt:
						'Create an image in a true-to-life photographic style with natural textures and lighting. This should depict a calm and serene mountain lake at sunrise, reflecting the snow-capped peaks on its mirror-like surface. No human presence or man-made structures should be included. The scene should evoke a sense of tranquility. The lighting should come from a low sun, giving rise to warm, soft, directional light with long shadows.',
					url: '/assets/images/apps/ai-image-generator/mock-storage/img-8gLbwpqBrc1IDzZPIBYXAm9A.png'
				}
			]
		}
	},
	{
		id: '3',
		favorite: true,
		formData: {
			prompt: 'Superhero battle in a rain-soaked city',
			negativePrompt: 'daytime scenes, peaceful settings',
			size: '1024x1024',
			artStyle: 'comic_book',
			style: 'vivid',
			mood: 'heroic',
			lighting: 'low_key',
			quality: 'hd'
		},
		response: {
			created: 1731148572,
			data: [
				{
					revised_prompt:
						"An inspiring battle scene in a rain-soaked city under the cover of night. This depiction should evoke the mood of an epic superhero clash. With strong contrast, dark tones and shadows playing a significant role in the image, showcasing the power and form of the characters in their heroic struggle. The art style is bold with thick outlines and flat, vibrant colors capturing comic strips' essence. Emphasize the intensity of the situation and the dynamic lighting effects, illuminating the heroes' struggle against the adversity they face.",
					url: '/assets/images/apps/ai-image-generator/mock-storage/img-lmedAH9nAcSvCWNDkaa4TJKz.png'
				}
			]
		}
	},
	{
		id: '4',
		favorite: false,
		formData: {
			prompt: "Ancient wizard's library with floating books and magical artifacts",
			negativePrompt: 'modern technology, contemporary clothing',
			size: '1024x1024',
			artStyle: 'fantasy_art',
			style: 'natural',
			mood: 'mystical',
			lighting: 'candlelight',
			quality: 'standard'
		},
		response: {
			created: 1731150059,
			data: [
				{
					revised_prompt:
						"Old wizard's library set in an ancient era, filled with hovering books and enigmatic magical artifacts. The space excludes any modern technology and individuals in contemporary clothing. The artistic interpretation should follow a genre characterized by imagination and mythical elements, encapsulating enchanted landscapes, fantastical creatures and a rich use of color. The over-all mood should evoke an air of mysticism and ethereality with a hint of mystery. The lighting should resemble the soft and warm glow of flickering candlelight, creating a cozy and historical ambiance.",
					url: '/assets/images/apps/ai-image-generator/mock-storage/img-7SQGty2KdzDNUx178Qv1fNPG.png'
				}
			]
		}
	},
	{
		id: '5',
		favorite: true,
		formData: {
			prompt: 'Futuristic samurai warrior in a cherry blossom garden',
			negativePrompt: 'guns, modern weapons, urban environment',
			size: '1024x1024',
			artStyle: 'anime',
			style: 'vivid',
			mood: 'dramatic',
			lighting: 'backlit',
			quality: 'hd'
		},
		response: {
			created: 1731150638,
			data: [
				{
					revised_prompt:
						'A futuristic samurai warrior, possibly of an Asian descent, poised in readiness in a tranquil garden adorned with blooming cherry blossoms. The warrior, beset with intricate, technology-infused armor of the future, is void of any guns or modern weapons. Invoking the style of pre-1912 Japanese woodblock prints, the scene combines bold lines and vibrant colors, suggestive of a Japanese animation-inspired artwork. Emotionally intense, the scene is heavily charged with dramatic lighting and shadow work, with the light source emanating from behind the subject, lending a striking silhouette effect against the soft glow of the garden.',
					url: '/assets/images/apps/ai-image-generator/mock-storage/img-YxPlnuFQ453Rq6uZPPDDnjBp.png'
				}
			]
		}
	}
];

export default mockGeneratedImagesList;
