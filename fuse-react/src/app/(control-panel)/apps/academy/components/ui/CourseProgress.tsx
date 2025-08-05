import LinearProgress from '@mui/material/LinearProgress';
import clsx from 'clsx';
import { Course } from '../../api/types';

type CourseProgressProps = {
	course: Course;
	className?: string;
};

/**
 * The CourseProgress component.
 */
function CourseProgress(props: CourseProgressProps) {
	const { course, className } = props;

	return (
		<LinearProgress
			className={clsx('h-0.5 w-full', className)}
			variant="determinate"
			value={(course.progress.currentStep * 100) / course.totalSteps}
			color="secondary"
		/>
	);
}

export default CourseProgress;
