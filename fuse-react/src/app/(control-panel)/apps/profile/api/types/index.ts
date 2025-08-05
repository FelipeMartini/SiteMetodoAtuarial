export type ProfileAlbum = {
	id?: string;
	userId: string;
	name?: string;
	info?: string;
	created_at?: string;
};

export type ProfileMediaItem = {
	id?: string;
	userId: string;
	album_id?: string;
	type?: string;
	title?: string;
	preview?: string;
	created_at?: string;
};

export type ProfileActivity = {
	id?: string;
	userId: string;
	user?: {
		name?: string;
		avatar?: string;
	};
	message?: string;
	time?: string;
};

export type ProfilePost = {
	id?: string;
	userId: string;
	user?: {
		name?: string;
		avatar?: string;
	};
	message?: string;
	time?: string;
	type?: string;
	like?: number;
	share?: number;
	media?: {
		type?: string;
		preview?: string;
	};
	comments?: {
		id?: string;
		user?: {
			name?: string;
			avatar?: string;
		};
		time?: string;
		message?: string;
	}[];
	article?: {
		title?: string;
		subtitle?: string;
		excerpt?: string;
		media?: {
			type?: string;
			preview?: string;
		};
	};
};

export type ProfileAbout = {
	id: string;
	userId: string;
	general?: {
		gender?: string;
		birthday?: string;
		locations?: string[];
		about?: string;
	};
	work?: {
		occupation?: string;
		skills?: string;
		jobs?: {
			company?: string;
			date?: string;
		}[];
	};
	contact?: {
		address?: string;
		tel?: string[];
		websites?: string[];
		emails?: string[];
	};
	groups?: {
		id?: string;
		name?: string;
		category?: string;
		members?: string;
	}[];
	friends?: {
		id?: string;
		name?: string;
		avatar?: string;
	}[];
};
