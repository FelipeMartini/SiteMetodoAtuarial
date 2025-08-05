import { useMemo, useState } from 'react';
import AiImageGenAppContext from './AiImageGenAppContext';
import { AiImageGenItem } from '../../api/types';

export function AiImageGenAppContextProvider({ children }: { children: React.ReactNode }) {
	const [apiKey, setApiKey] = useState('');
	const [selectedItem, setSelectedItem] = useState<AiImageGenItem | null>(null);
	const [configDialogOpen, setConfigDialogOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const contextValue = useMemo(
		() => ({
			apiKey,
			setApiKey,
			configDialogOpen,
			setConfigDialogOpen,
			selectedItem,
			setSelectedItem,
			loading,
			setLoading
		}),
		[configDialogOpen, setConfigDialogOpen, apiKey, setApiKey, selectedItem, setSelectedItem, loading, setLoading]
	);

	return <AiImageGenAppContext.Provider value={contextValue}>{children}</AiImageGenAppContext.Provider>;
}
