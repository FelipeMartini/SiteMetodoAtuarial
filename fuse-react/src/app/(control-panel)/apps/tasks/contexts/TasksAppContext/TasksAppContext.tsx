import { createContext } from 'react';

type TasksAppContextType = {
	searchText: string;
	setSearchText: (text: string) => void;
};

export const TasksAppContext = createContext<TasksAppContextType | undefined>(undefined);
