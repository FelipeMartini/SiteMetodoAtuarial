import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { getScrumboardBoardQueryKey } from '../boards/useGetScrumboardBoard';
import { OrderResult, ScrumboardBoard } from '../../types';
import { scrumboardApiService } from '../../services/scrumboardApiService';
import reorder from '../../../lib/utils/reorder';
import { reorderQuoteMap } from '../../../lib/utils/reorder';
import { useGetScrumboardBoard } from '../boards/useGetScrumboardBoard';
export function useScrumboardReorder(boardId: string) {
	const queryClient = useQueryClient();
	const { data: initialBoard } = useGetScrumboardBoard(boardId);
	const [board, setBoard] = useState<ScrumboardBoard | undefined>(initialBoard);

	useEffect(() => {
		if (initialBoard) {
			setBoard(initialBoard);
		}
	}, [initialBoard]);

	const updateBoard = useCallback(
		(newBoard: ScrumboardBoard) => {
			setBoard(newBoard);
			queryClient.setQueryData(getScrumboardBoardQueryKey(newBoard.id), newBoard);
		},
		[queryClient]
	);

	const reorderList = useCallback(
		(orderResult: OrderResult) => {
			if (!board || !orderResult.destination) return;

			const ordered = reorder(_.merge([], board.lists), orderResult.source.index, orderResult.destination.index);

			const newBoard = {
				...board,
				lists: ordered
			} as ScrumboardBoard;

			updateBoard(newBoard);

			scrumboardApiService
				.updateScrumboardBoardListOrder({
					orderResult,
					board
				})
				.catch(() => {
					// Roll back on error
					setBoard(board);
					queryClient.setQueryData(getScrumboardBoardQueryKey(board.id), board);
				})
				.finally(() => {
					queryClient.invalidateQueries({ queryKey: getScrumboardBoardQueryKey(board.id) });
				});
		},
		[board, queryClient, updateBoard]
	);

	const reorderCard = useCallback(
		(orderResult: OrderResult) => {
			if (!board || !orderResult.destination) return;

			const ordered = reorderQuoteMap(_.merge([], board.lists), orderResult.source, orderResult.destination);

			const newBoard = {
				...board,
				lists: ordered
			} as ScrumboardBoard;

			updateBoard(newBoard);

			scrumboardApiService
				.updateScrumboardBoardCardOrder({
					orderResult,
					board
				})
				.catch(() => {
					// Roll back on error
					setBoard(board);
					queryClient.setQueryData(getScrumboardBoardQueryKey(board.id), board);
				})
				.finally(() => {
					queryClient.invalidateQueries({ queryKey: getScrumboardBoardQueryKey(board.id) });
				});
		},
		[board, queryClient, updateBoard]
	);

	return {
		board,
		reorderList,
		reorderCard,
		setBoard
	};
}
