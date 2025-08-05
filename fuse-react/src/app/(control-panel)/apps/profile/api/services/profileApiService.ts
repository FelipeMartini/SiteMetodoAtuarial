import { api } from '@/utils/api';
import type { ProfileAlbum, ProfileMediaItem, ProfileActivity, ProfilePost, ProfileAbout } from '../types';

export const profileApiService = {
	getAlbums: async (): Promise<ProfileAlbum[]> => {
		return api.get('mock/profile/albums', { searchParams: { userId: '0' } }).json();
	},

	getMediaItems: async (): Promise<ProfileMediaItem[]> => {
		return api.get('mock/profile/media-items', { searchParams: { userId: '0' } }).json();
	},

	getActivities: async (): Promise<ProfileActivity[]> => {
		return api.get('mock/profile/activities', { searchParams: { userId: '0' } }).json();
	},

	getPosts: async (): Promise<ProfilePost[]> => {
		return api.get('mock/profile/posts', { searchParams: { userId: '0' } }).json();
	},

	getAbout: async (): Promise<ProfileAbout> => {
		const response = await api.get('mock/profile/about', { searchParams: { userId: '0' } }).json<ProfileAbout[]>();
		return response.length > 0 ? response[0] : null;
	}
};
