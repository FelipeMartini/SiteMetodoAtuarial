export type SubTask = {
	id: string;
	title: string;
	completed: boolean;
};

export type Task = {
	id: string;
	type: string;
	title: string;
	notes: string;
	completed: boolean;
	dueDate?: string | null;
	priority: number;
	tags: string[];
	assignedTo?: null | string;
	subTasks: SubTask[];
	order: number;
};

export type Tag = {
	id: string;
	title: string;
};

export type ReorderTasksRequest = {
	startIndex: number;
	endIndex: number;
};
