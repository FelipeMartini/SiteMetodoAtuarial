import { FileManagerAppContext } from './FileManagerAppContext';
import { useContext } from 'react';

export function useFileManagerAppContext() {
	const context = useContext(FileManagerAppContext);

	if (context === undefined) {
		throw new Error('useFileManager must be used within a FileManagerProvider');
	}

	return context;
}
