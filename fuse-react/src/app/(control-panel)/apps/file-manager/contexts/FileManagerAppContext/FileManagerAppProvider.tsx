import { ReactNode, useCallback, useState } from 'react';
import { FileManagerAppContext, FileManagerAppContextType } from './FileManagerAppContext';

export function FileManagerAppProvider({ children }: { children: ReactNode }) {
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [searchText, setSearchText] = useState<string>('');
	const [currentPath, setCurrentPath] = useState<string>('/');

	const resetSelectedItemId = useCallback(() => {
		setSelectedItemId(null);
	}, []);

	const value: FileManagerAppContextType = {
		searchText,
		currentPath,
		selectedItemId,
		setSelectedItemId,
		setSearchText,
		setCurrentPath,
		resetSelectedItemId
	};

	return <FileManagerAppContext.Provider value={value}>{children}</FileManagerAppContext.Provider>;
}
