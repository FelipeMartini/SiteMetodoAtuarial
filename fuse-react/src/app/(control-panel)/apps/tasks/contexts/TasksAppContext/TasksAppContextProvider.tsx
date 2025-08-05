import { TasksAppContext } from './TasksAppContext';
import { ReactNode } from 'react';
import { useState } from 'react';

type TasksAppContextProviderProps = {
	children: ReactNode;
};

export function TasksAppContextProvider({ children }: TasksAppContextProviderProps) {
	const [searchText, setSearchText] = useState('');

	const value = {
		searchText,
		setSearchText
	};

	return <TasksAppContext.Provider value={value}>{children}</TasksAppContext.Provider>;
}
