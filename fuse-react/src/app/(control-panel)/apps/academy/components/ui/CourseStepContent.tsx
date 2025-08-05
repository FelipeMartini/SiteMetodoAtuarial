import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import FuseLoading from '@fuse/core/FuseLoading';
import { useCourseStepContent } from '../../api/hooks/steps/useCourseStepContent';
import { CourseStep } from '../../api/types';

type CourseStepContentProps = {
	step: CourseStep;
};

function CourseStepContent(props: CourseStepContentProps) {
	const { step } = props;
	const theme = useTheme();
	const { data: stepContent, isLoading } = useCourseStepContent(step?.id);

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<div className="mx-auto w-full overflow-hidden rounded-xl p-6 sm:my-2 sm:p-10 sm:py-12 lg:mt-4">
			<Typography
				variant="h4"
				className="mb-4 font-medium"
			>
				{step?.title}
			</Typography>

			<Typography
				className="mb-8 text-2xl"
				variant="h5"
			>
				{step?.subtitle}
			</Typography>

			<div
				className="prose prose-sm dark:prose-invert w-full max-w-full"
				dangerouslySetInnerHTML={{ __html: stepContent?.html || '' }}
				dir={theme.direction}
			/>
		</div>
	);
}

export default CourseStepContent;
