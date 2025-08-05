import api from '@/utils/api';
import { FileManagerItem, FileItem, FolderItem } from '../types';

export const fileManagerApi = {
	getItems: (path: string): Promise<FileManagerItem[]> => {
		return api.get('mock/file-manager/items', { searchParams: { path } }).json();
	},

	getItem: (id: string): Promise<FileManagerItem> => {
		return api.get(`mock/file-manager/items/${id}`).json();
	},

	getAllFolderItems: (): Promise<FileManagerItem[]> => {
		return api.get('mock/file-manager/items', { searchParams: { type: 'folder' } }).json();
	},

	getFolderItems: (folderId: string): Promise<FileManagerItem[]> => {
		return api.get('mock/file-manager/items', { searchParams: { folderId } }).json();
	},

	createFolder: (path: string, name: string): Promise<FolderItem> => {
		return api.post('mock/file-manager/folders', { json: { path, name } }).json();
	},

	uploadFile: (path: string, file: File): Promise<FileItem> => {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('path', path);

		return api.post('mock/file-manager/files', { json: formData }).json();
	},

	deleteItems: (ids: string[]): Promise<void> => {
		return api.delete('mock/file-manager/items', { json: { ids } }).json();
	},

	renameItem: ({ id, newName }: { id: string; newName: string }): Promise<FileManagerItem> => {
		return api.patch(`mock/file-manager/items/${id}/rename`, { json: { name: newName } }).json();
	}
};
