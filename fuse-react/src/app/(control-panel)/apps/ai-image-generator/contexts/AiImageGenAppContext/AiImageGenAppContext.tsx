import { createContext } from 'react';
import { AiImageGenItem } from '../../api/types';

export type AiImageGenAppContextType = {
	apiKey: string;
	setApiKey: (apiKey: string) => void;
	setConfigDialogOpen: (isOpen?: boolean) => void;
	configDialogOpen?: boolean;
	selectedItem: AiImageGenItem | null;
	setSelectedItem: (item: AiImageGenItem | null) => void;
	loading: boolean;
	setLoading: (loading: boolean) => void;
};

const AiImageGenAppContext = createContext<AiImageGenAppContextType>({
	apiKey: '',
	setApiKey: () => {},
	setConfigDialogOpen: () => {},
	configDialogOpen: false,
	selectedItem: null,
	setSelectedItem: () => {},
	loading: false,
	setLoading: () => {}
});

export default AiImageGenAppContext;
