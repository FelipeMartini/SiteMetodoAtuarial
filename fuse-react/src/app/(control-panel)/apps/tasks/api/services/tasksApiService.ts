import { api } from '@/utils/api';
import { Task, Tag, ReorderTasksRequest } from '../types';

export const tasksApiService = {
	getTasks: () => api.get(`mock/tasks/items`).json<Task[]>(),

	reorderTasks: (data: ReorderTasksRequest) => api.post(`mock/tasks/reorder`, { json: data }).json<Task[]>(),

	createTask: (task: Omit<Task, 'id'>) => api.post(`mock/tasks/items`, { json: task }).json<Task>(),

	getTask: (taskId: string) => api.get(`mock/tasks/items/${taskId}`).json<Task>(),

	deleteTask: (taskId: string) => api.delete(`mock/tasks/items/${taskId}`).json(),

	updateTasks: (tasks: Partial<Task>[]) => api.put(`mock/tasks/items`, { json: tasks }).json<Task[]>(),

	updateTask: ({ taskId, task }: { taskId: string; task: Partial<Task> }) =>
		api.put(`mock/tasks/items/${taskId}`, { json: task }).json<Task>(),

	getTags: () => api.get(`mock/tasks/tags`).json<Tag[]>(),

	createTag: (tag: Omit<Tag, 'id'>) => api.post(`mock/tasks/tags`, { json: tag }).json<Tag>()
};
