import { createContext } from 'react';
import { ScrumboardCard } from '../../api/types';

// Define the context type
type ScrumboardAppContextType = {
	cardDialog: {
		open: boolean;
		data: ScrumboardCard | null;
	};
	openCardDialog: (card: ScrumboardCard) => void;
	closeCardDialog: () => void;
};

export const ScrumboardAppContext = createContext<ScrumboardAppContextType | null>(null);
