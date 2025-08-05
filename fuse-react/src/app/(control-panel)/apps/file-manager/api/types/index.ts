export interface FileItem {
	id: string;
	name: string;
	type: string;
	size: string;
	createdBy: string;
	createdAt: string;
	modifiedAt: string;
	contents: string;
	description: string;
	folderId?: string;
}

export interface FolderItem {
	id: string;
	name: string;
	type: string;
	size: string;
	createdBy: string;
	createdAt: string;
	modifiedAt: string;
	contents: string;
	description: string;
	folderId?: string;
}

export type FileManagerItem = FileItem | FolderItem;

export type FileManagerPath = {
	name: string;
	id: string;
};
