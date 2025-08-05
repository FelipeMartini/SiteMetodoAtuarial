import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Link from '@fuse/core/Link';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import CourseInfo from './CourseInfo';
import CourseProgress from './CourseProgress';
import { Course } from '../../api/types';

type CourseCardProps = {
	course: Course;
};

/**
 * The CourseCard component.
 */
function CourseCard(props: CourseCardProps) {
	const { course } = props;

	function buttonStatus() {
		switch (course.activeStep) {
			case course.totalSteps:
				return 'Completed';
			case 0:
				return 'Start';
			default:
				return 'Continue';
		}
	}

	return (
		<Card className="flex h-80 flex-col shadow-sm md:h-96">
			<CardContent className="flex flex-auto flex-col p-4">
				<CourseInfo course={course} />
			</CardContent>
			<CourseProgress course={course} />
			<CardActions
				className="items-center justify-end px-4 py-4"
				sx={(theme) => ({
					backgroundColor: lighten(theme.palette.background.default, 0.03),
					...theme.applyStyles('light', {
						backgroundColor: lighten(theme.palette.background.default, 0.4)
					})
				})}
			>
				<Button
					to={`/apps/academy/courses/${course.id}/${course.slug}`}
					component={Link}
					className="px-3"
					color="secondary"
					variant="contained"
					size="small"
					endIcon={<FuseSvgIcon>lucide:arrow-right</FuseSvgIcon>}
				>
					{buttonStatus()}
				</Button>
			</CardActions>
		</Card>
	);
}

export default CourseCard;
