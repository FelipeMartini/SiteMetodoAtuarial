import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { Task } from '../types';

/**
 * The section model.
 */
const SectionModel = (data: PartialDeep<Task>): Task =>
	_.defaults(data || {}, {
		type: 'section',
		title: '',
		notes: '',
		completed: false,
		dueDate: null,
		priority: 0,
		tags: [],
		assignedTo: null,
		subTasks: [],
		order: 0
	}) as Task;

export default SectionModel;
