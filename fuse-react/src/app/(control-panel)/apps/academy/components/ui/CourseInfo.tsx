import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import CourseCategory from './CourseCategory';
import { Course } from '../../api/types';

type CourseInfoProps = {
	course: Course;
	className?: string;
};

/**
 * The CourseInfo component.
 */
function CourseInfo(props: CourseInfoProps) {
	const { course, className } = props;

	if (!course) {
		return null;
	}

	return (
		<div className={clsx('w-full', className)}>
			<div className="mb-4 flex items-center justify-between">
				<CourseCategory slug={course.category} />

				{course.progress.completed > 0 && (
					<FuseSvgIcon className="text-green-600">lucide:badge-check</FuseSvgIcon>
				)}
			</div>

			<Typography className="text-lg font-medium">{course.title}</Typography>

			<Typography
				className="text-md mt-0.5 line-clamp-2"
				color="text.secondary"
			>
				{course.description}
			</Typography>

			<Divider
				className="mx-0 my-6 w-12"
				sx={{ opacity: 0.6 }}
				variant="middle"
			/>

			<Typography
				className="text-md flex items-center gap-1.5"
				color="text.secondary"
			>
				<FuseSvgIcon color="disabled">lucide:clock</FuseSvgIcon>
				<span className="leading-none whitespace-nowrap">{`${course.duration} minutes`}</span>
			</Typography>
			<Typography
				className="text-md mt-2 flex items-center gap-1.5"
				color="text.secondary"
			>
				<FuseSvgIcon color="disabled">lucide:graduation-cap</FuseSvgIcon>
				<span className="leading-none whitespace-nowrap">
					{course.progress.completed === 1 && 'Completed once'}
					{course.progress.completed === 2 && 'Completed twice'}
					{course.progress.completed > 2 && `Completed ${course.progress.completed} times`}
					{course.progress.completed <= 0 && 'Never completed'}
				</span>
			</Typography>
		</div>
	);
}

export default CourseInfo;
