import { createContext } from 'react';

export type FileManagerAppContextType = {
	searchText: string;
	currentPath: string;
	selectedItemId: string | null;
	setSelectedItemId: (id: string | null) => void;
	setSearchText: (text: string) => void;
	setCurrentPath: (path: string) => void;
	resetSelectedItemId: () => void;
};

export const FileManagerAppContext = createContext<FileManagerAppContextType | undefined>(undefined);
