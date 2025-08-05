import { DropResult } from '@hello-pangea/dnd';

export type ScrumboardMember = {
	id: string;
	name: string;
	avatar: string;
	class: string;
};

export type ScrumboardList = {
	id: string;
	boardId: string;
	title: string;
};

export type ScrumboardBoardList = {
	id: string;
	cards: ScrumboardCard['id'][];
};

export type ScrumboardLabel = {
	id: string;
	boardId: string;
	title: string;
};

export type ScrumboardAttachment = {
	id: string;
	name: string;
	src: string;
	url: string;
	time: number;
	type: string;
};

export type ScrumboardCheckListItem = {
	id: number;
	name: string;
	checked: boolean;
};

export type ScrumboardChecklist = {
	id?: string;
	name: string;
	checkItems: ScrumboardCheckListItem[];
};

export type ScrumboardCard = {
	id: string;
	boardId: string;
	listId: string;
	title: string;
	description: string;
	labels: string[];
	dueDate?: number | null;
	attachmentCoverId: string;
	memberIds: string[];
	attachments: ScrumboardAttachment[];
	subscribed: boolean;
	checklists: ScrumboardChecklist[];
	activities: {
		id: string;
		type: string;
		idMember: string;
		message: string;
		time: number;
	}[];
};

export type ScrumboardBoard = {
	id: string;
	title: string;
	description: string;
	icon: string;
	lastActivity: string;
	members: string[];
	settings: {
		subscribed: boolean;
		cardCoverImages: boolean;
	};
	lists: {
		id: string;
		cards?: string[];
	}[];
};

export type ScrumboardComment = {
	id: string;
	type: string;
	idMember: string;
	message: string;
	time: number;
};

export type OrderResult = {
	source: DropResult['source'];
	destination: DropResult['destination'];
};
