import { ReactNode, useState } from 'react';
import { ScrumboardCard } from '../../api/types';
import { ScrumboardAppContext } from './ScrumboardAppContext';

// Initial state
const initialState = {
	cardDialog: {
		open: false,
		data: null
	}
};

export function ScrumboardAppContextProvider({ children }: { children: ReactNode }) {
	const [cardDialog, setCardDialog] = useState(initialState.cardDialog);

	const openCardDialog = (card: ScrumboardCard) => {
		setCardDialog({ open: true, data: card });
	};

	const closeCardDialog = () => {
		setCardDialog(initialState.cardDialog);
	};

	const value = {
		cardDialog,
		openCardDialog,
		closeCardDialog
	};

	return <ScrumboardAppContext.Provider value={value}>{children}</ScrumboardAppContext.Provider>;
}
