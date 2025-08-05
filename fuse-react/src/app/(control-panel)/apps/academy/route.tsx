import { lazy } from 'react';
import { Navigate } from 'react-router';
import { FuseRouteItemType } from '@fuse/utils/FuseUtils';
import { Outlet } from 'react-router';

const CourseView = lazy(() => import('./components/views/CourseView'));
const CoursesView = lazy(() => import('./components/views/CoursesView'));

/**
 * The Academy app routes.
 */
const route: FuseRouteItemType = {
	path: 'apps/academy',
	element: <Outlet />,
	children: [
		{
			path: '',
			element: <Navigate to="/apps/academy/courses" />
		},
		{
			path: 'courses/:courseId/*',
			element: <CourseView />
		},
		{
			path: 'courses',
			element: <CoursesView />
		}
	]
};

export default route;
