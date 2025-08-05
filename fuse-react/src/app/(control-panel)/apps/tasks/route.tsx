import { lazy } from 'react';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import TaskForm from './components/forms/task-form/TaskForm';
import { Outlet } from 'react-router';

const TasksAppView = lazy(() => import('./components/views/TasksAppView'));

/**
 * The Tasks App Route
 */
const route: FuseRouteItemType = {
	path: 'apps/tasks',
	element: (
		<TasksAppView>
			<Outlet />
		</TasksAppView>
	),
	children: [
		{
			path: ':taskId',
			element: <TaskForm />
		},
		{
			path: ':taskId/:newTaskType',
			element: <TaskForm />
		}
	]
};

export default route;
