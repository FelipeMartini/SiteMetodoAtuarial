import { api } from '@/utils/api';
import _ from 'lodash';
import reorder, { reorderQuoteMap } from '../../lib/utils/reorder';
import CardModel from '../models/CardModel';
import BoardModel from '../models/BoardModel';
import {
	ScrumboardMember,
	ScrumboardList,
	ScrumboardLabel,
	ScrumboardCard,
	ScrumboardBoard,
	OrderResult
} from '../types';
import { PartialDeep } from 'type-fest';

export const scrumboardApiService = {
	// Members API
	getScrumboardMembers: async (): Promise<ScrumboardMember[]> => {
		return api.get('mock/scrumboard/members').json();
	},

	createScrumboardMember: async (member: ScrumboardMember) => {
		return api.post('mock/scrumboard/members', { json: member }).json();
	},

	getScrumboardMember: async (memberId: string): Promise<ScrumboardMember> => {
		return api.get(`mock/scrumboard/members/${memberId}`).json();
	},

	updateScrumboardMember: async (member: PartialDeep<ScrumboardMember>) => {
		return api.put(`mock/scrumboard/members/${member.id}`, { json: member }).json();
	},

	deleteScrumboardMember: async (memberId: string) => {
		return api.delete(`mock/scrumboard/members/${memberId}`).json();
	},

	// Lists API
	getScrumboardBoardLists: async (boardId: string): Promise<ScrumboardList[]> => {
		return api.get('mock/scrumboard/lists', { searchParams: { boardId } }).json();
	},

	createScrumboardBoardList: async (listItem: Omit<ScrumboardList, 'id'>) => {
		return api.post('mock/scrumboard/lists', { json: listItem }).json();
	},

	getScrumboardBoardList: async (listId: string): Promise<ScrumboardList> => {
		return api.get(`mock/scrumboard/lists/${listId}`).json();
	},

	updateScrumboardBoardList: async (list: ScrumboardList) => {
		return api.put(`mock/scrumboard/lists/${list.id}`, { json: list }).json();
	},

	deleteScrumboardBoardList: async (listId: string) => {
		return api.delete(`mock/scrumboard/lists/${listId}`).json();
	},

	// Labels API
	getScrumboardBoardLabels: async (boardId: string): Promise<ScrumboardLabel[]> => {
		return api.get('mock/scrumboard/labels', { searchParams: { boardId } }).json();
	},

	createScrumboardBoardLabel: async ({
		boardId,
		label
	}: {
		boardId: string;
		label: PartialDeep<ScrumboardLabel>;
	}) => {
		return api.post('mock/scrumboard/labels', { json: { ...label, boardId } }).json();
	},

	getScrumboardBoardLabel: async (labelId: string): Promise<ScrumboardLabel> => {
		return api.get(`mock/scrumboard/labels/${labelId}`).json();
	},

	updateScrumboardBoardLabel: async (label: ScrumboardLabel) => {
		return api.put(`mock/scrumboard/labels/${label.id}`, { json: label }).json();
	},

	deleteScrumboardBoardLabel: async (labelId: string) => {
		return api.delete(`mock/scrumboard/labels/${labelId}`).json();
	},

	// Cards API
	getScrumboardBoardCards: async (boardId: string): Promise<ScrumboardCard[]> => {
		return api.get('mock/scrumboard/cards', { searchParams: { boardId } }).json();
	},

	createScrumboardBoardCard: async ({
		boardId,
		listId,
		card
	}: {
		boardId: string;
		listId: string;
		card: PartialDeep<ScrumboardCard>;
	}): Promise<ScrumboardCard> => {
		return api
			.post('mock/scrumboard/cards', {
				json: CardModel({
					...card,
					boardId,
					listId
				})
			})
			.json();
	},

	updateScrumboardBoardCard: async (card: PartialDeep<ScrumboardCard>) => {
		return api.put(`mock/scrumboard/cards/${card.id}`, { json: card }).json();
	},

	deleteScrumboardBoardCard: async (cardId: string) => {
		return api.delete(`mock/scrumboard/cards/${cardId}`).json();
	},

	// Boards API
	getScrumboardBoards: async (): Promise<ScrumboardBoard[]> => {
		return api.get('mock/scrumboard/boards').json();
	},

	createScrumboardBoard: async (board?: PartialDeep<ScrumboardBoard>) => {
		return api.post('mock/scrumboard/boards', { json: BoardModel(board) }).json();
	},

	getScrumboardBoard: async (boardId: string): Promise<ScrumboardBoard> => {
		return api.get(`mock/scrumboard/boards/${boardId}`).json();
	},

	updateScrumboardBoard: async (board: PartialDeep<ScrumboardBoard>) => {
		return api.put(`mock/scrumboard/boards/${board.id}`, { json: board }).json();
	},

	deleteScrumboardBoard: async (boardId: string) => {
		return api.delete(`mock/scrumboard/boards/${boardId}`).json();
	},

	// Order API
	updateScrumboardBoardListOrder: async ({
		orderResult,
		board
	}: {
		orderResult: OrderResult;
		board: ScrumboardBoard;
	}): Promise<void> => {
		const ordered = reorder(_.merge([], board.lists), orderResult.source.index, orderResult.destination.index);

		return api
			.put(`mock/scrumboard/boards/${board.id}`, {
				json: { ...board, lists: ordered }
			})
			.json();
	},

	updateScrumboardBoardCardOrder: async ({
		orderResult,
		board
	}: {
		orderResult: OrderResult;
		board: ScrumboardBoard;
	}) => {
		const ordered = reorderQuoteMap(_.merge([], board.lists), orderResult.source, orderResult.destination);

		return api
			.put(`mock/scrumboard/boards/${board.id}`, {
				json: { ...board, lists: ordered }
			})
			.json();
	}
};
