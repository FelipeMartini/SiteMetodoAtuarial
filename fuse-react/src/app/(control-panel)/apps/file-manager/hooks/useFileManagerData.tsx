'use client';

import useParams from '@fuse/hooks/useParams';
import _ from 'lodash';
import { useMemo } from 'react';
import { FileManagerItem, FileManagerPath } from '../api/types';
import { useFolderItems } from '../api/hooks/folders/useFolderItems';
import { useFileManagerAppContext } from '../contexts/FileManagerAppContext/useFileManagerAppContext';
import { useAllFolderItems } from '../api/hooks/folders/useAllFolderItems';

function useFileManagerData() {
	const routeParams = useParams();
	const { folderId } = routeParams;
	const _folderId = folderId ?? 'root';
	const { selectedItemId } = useFileManagerAppContext();

	const { data: allFolderItems } = useAllFolderItems();

	const { data: folderItems, isLoading } = useFolderItems(_folderId);
	const folders = useMemo(() => _.filter(folderItems, { type: 'folder' }), [folderItems]);
	const files = useMemo(() => _.reject(folderItems, { type: 'folder' }), [folderItems]);

	const path = useMemo(() => {
		const path: FileManagerPath[] = [];

		let currentFolder: FileManagerItem | null = null;

		if (_folderId) {
			currentFolder = _.find(allFolderItems, { id: _folderId });

			if (currentFolder) {
				path.push(currentFolder);
			}
		}

		while (currentFolder?.folderId) {
			currentFolder = allFolderItems.find((item) => item.id === currentFolder?.folderId);

			if (currentFolder) {
				path.unshift(currentFolder);
			}
		}
		return path;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [folderItems, folderId]);

	const selectedItem = useMemo(() => _.find(folderItems, { id: selectedItemId }), [folderItems, selectedItemId]);

	return {
		folders,
		files,
		isLoading,
		selectedItem,
		selectedItemId,
		path
	};
}

export default useFileManagerData;
