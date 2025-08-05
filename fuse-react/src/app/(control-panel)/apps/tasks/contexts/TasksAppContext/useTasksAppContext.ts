import { TasksAppContext } from './TasksAppContext';
import { useContext } from 'react';

export function useTasksAppContext() {
	const context = useContext(TasksAppContext);

	if (context === undefined) {
		throw new Error('useTasksAppContext must be used within a TasksAppContextProvider');
	}

	return context;
}
