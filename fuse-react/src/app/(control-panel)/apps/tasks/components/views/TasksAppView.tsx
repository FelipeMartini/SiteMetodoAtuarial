'use client';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useState, ReactNode } from 'react';
import useParams from '@fuse/hooks/useParams';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import TasksSidebarContent from '../ui/TasksSidebarContent';
import TasksHeader from '../ui/TasksHeader';
import TasksList from '../ui/TasksList';
import { TasksAppContextProvider } from '../../contexts/TasksAppContext/TasksAppContextProvider';

const Root = styled(FusePageSimple)(() => ({
	'& .container': {
		maxWidth: '100%!important'
	}
}));

type TasksAppProps = {
	children: ReactNode;
};

/**
 * The tasks app.
 */
function TasksAppView(props: TasksAppProps) {
	const { children } = props;
	const routeParams = useParams();
	const { taskId } = routeParams;
	const { newTaskType } = routeParams;
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	useEffect(() => {
		setRightSidebarOpen(Boolean(taskId || newTaskType));
	}, [taskId, newTaskType]);

	return (
		<Root
			header={<TasksHeader />}
			content={<TasksList />}
			rightSidebarProps={{
				content: <TasksSidebarContent>{children}</TasksSidebarContent>,
				open: rightSidebarOpen,
				onClose: () => setRightSidebarOpen(false),
				width: 640
			}}
			scroll={isMobile ? 'page' : 'content'}
		/>
	);
}

const TasksAppWrapper = (props: TasksAppProps) => {
	return (
		<TasksAppContextProvider>
			<TasksAppView {...props} />
		</TasksAppContextProvider>
	);
};

export default TasksAppWrapper;
