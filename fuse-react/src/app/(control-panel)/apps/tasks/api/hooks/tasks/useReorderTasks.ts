import type { Task } from '../../types';
import { useState, useCallback, useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useUpdateTasks } from './useUpdateTasks';
import { useGetTasks } from './useGetTasks';
import { useTasksAppContext } from '../../../contexts/TasksAppContext/useTasksAppContext';

export function useReorderTasks() {
	const { data: tasks = [], isLoading } = useGetTasks();
	const { searchText } = useTasksAppContext();
	const isFiltered = useMemo(() => searchText.length > 0, [searchText]);
	const filteredTasks = useMemo(() => {
		return tasks.filter((task) => task.title.toLowerCase().includes(searchText.toLowerCase()));
	}, [tasks, searchText]);

	const { mutate: updateTasks } = useUpdateTasks();

	const [currentTasks, setCurrentTasks] = useState<Partial<Task>[]>([]);

	const handleUpdateTasks = useCallback((_tasks: Partial<Task>[]) => {
		if (!Array.isArray(_tasks)) return;

		setCurrentTasks([..._tasks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
	}, []);

	useEffect(() => {
		handleUpdateTasks(tasks);
	}, [tasks, handleUpdateTasks]);

	const reorder = useCallback(
		({ startIndex, endIndex }: { startIndex: number; endIndex: number }) => {
			const ordered = _.merge([], tasks).sort((a: Task, b: Task) => a.order - b.order) as Task[];

			const [removed] = ordered.splice(startIndex, 1);

			ordered.splice(endIndex, 0, removed);

			// Update the order property of each task
			const updatedTasks = ordered.map((task, index) => ({
				...task,
				order: index
			}));

			handleUpdateTasks(updatedTasks);
			updateTasks(updatedTasks);
		},
		[tasks, updateTasks, handleUpdateTasks]
	);

	return {
		tasks: isFiltered ? filteredTasks : currentTasks,
		isFiltered,
		reorder,
		isLoading
	};
}
