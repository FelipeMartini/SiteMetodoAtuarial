import { useMemo } from 'react';
import { useGetScrumboardBoardLabels } from './useGetScrumboardBoardLabels';
import _ from 'lodash';
import { ScrumboardLabel } from '../../types';

export function useGetScrumboardLabelById(boardId: string, labelId: string) {
	const { data: labels } = useGetScrumboardBoardLabels(boardId);

	return useMemo(() => {
		if (!labels) {
			return null;
		}

		return _.find(labels as ScrumboardLabel[], { id: labelId });
	}, [labels, labelId]);
}
