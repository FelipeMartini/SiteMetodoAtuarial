'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import { useEffect, useRef, useState } from 'react';
import useParams from '@fuse/hooks/useParams';
import Link from '@fuse/core/Link';
import { Step, StepContent, StepLabel } from '@mui/material';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404PageView from '@/app/(public)/(errors)/components/views/Error404PageView';
import CourseInfo from '../ui/CourseInfo';
import CourseProgress from '../ui/CourseProgress';
import CourseStepContent from '../ui/CourseStepContent';
import { useAcademyCourse } from '../../api/hooks/courses/useAcademyCourse';
import { useCourseSteps } from '../../api/hooks/steps/useCourseSteps';
import { useUpdateCourse } from '../../api/hooks/courses/useUpdateCourse';
import { styled } from '@mui/material/styles';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-contentWrapper': {
		paddingTop: 2,
		paddingLeft: 2
	},
	'& .FusePageSimple-content': {
		boxShadow: theme.vars.shadows[2],
		borderRadius: '12px 0 0 0',
		backgroundColor: theme.vars.palette.background.paper
	},
	'& .FusePageSimple-sidebarWrapper': {
		border: 'none'
	},
	'& .FusePageSimple-sidebarContent': {
		backgroundColor: theme.vars.palette.background.default
	}
}));

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
	dir?: string;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, dir, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`course-tabpanel-${index}`}
			aria-labelledby={`course-tab-${index}`}
			dir={dir}
			{...other}
			className="flex-auto"
		>
			{value === index && <Box className="h-full">{children}</Box>}
		</div>
	);
}

/**
 * The Course page.
 */
function CourseView() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const theme = useTheme();
	const pageLayout = useRef(null);
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const params = useParams();
	const courseId = params?.courseId;

	const { data: course, isLoading } = useAcademyCourse(courseId);
	const { data: courseSteps, isLoading: isCourseStepsLoading } = useCourseSteps(courseId);
	const { mutate: updateCourse } = useUpdateCourse();

	useEffect(() => {
		/**
		 * If the course is opened for the first time
		 * Change ActiveStep to 1
		 */
		if (course && course?.progress?.currentStep === 0) {
			updateCourse({
				courseId,
				data: { ...course, progress: { currentStep: 1, completed: 0 } }
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [course]);

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	const currentStep = course?.progress?.currentStep || 0;

	function updateCurrentStep(index: number) {
		if (course && (index > course.totalSteps || index < 0)) {
			return;
		}

		updateCourse({
			courseId,
			data: {
				...course,
				progress: {
					currentStep: index,
					completed: index === course.totalSteps ? 1 : course.progress.completed
				}
			}
		});
	}

	function handleNext() {
		updateCurrentStep(currentStep + 1);
	}

	function handleBack() {
		updateCurrentStep(currentStep - 1);
	}

	function handleStepChange(index: number) {
		updateCurrentStep(index + 1);
	}

	const activeStep = currentStep !== 0 ? currentStep : 1;

	if (isLoading || isCourseStepsLoading) {
		return <FuseLoading />;
	}

	if (!course) {
		return <Error404PageView />;
	}

	return (
		<Root
			content={
				<>
					<div className="flex flex-col">
						{!isMobile && (
							<CourseProgress
								className="sticky top-0 z-10"
								course={course}
							/>
						)}

						{isMobile && (
							<Paper
								className="shadow-0 sticky top-0 z-10 flex w-full items-center border-b-1 px-4 py-2"
								square
							>
								<IconButton
									to="/apps/academy/courses"
									component={Link}
								>
									<FuseSvgIcon>
										{theme.direction === 'ltr' ? 'lucide:arrow-left' : 'lucide:arrow-right'}
									</FuseSvgIcon>
								</IconButton>

								<Typography className="text-md mx-2.5 font-medium tracking-tight">
									{course.title}
								</Typography>
							</Paper>
						)}

						<div className="flex min-h-full w-full flex-auto flex-col">
							{courseSteps?.map((step, index) => (
								<TabPanel
									key={index}
									value={activeStep - 1}
									index={index}
									dir={theme.direction}
								>
									<div className="flex min-h-full justify-center p-4 pb-16 sm:p-6 sm:pb-16 md:p-12 md:pb-24">
										<CourseStepContent step={step} />
									</div>
								</TabPanel>
							))}

							{!isMobile && (
								<div className="sticky bottom-0 z-10 flex w-full items-center justify-center p-4 pb-8">
									<ButtonGroup
										variant="contained"
										aria-label="Next and previous buttons"
										color="secondary"
									>
										<Button
											startIcon={<FuseSvgIcon>lucide:arrow-left</FuseSvgIcon>}
											onClick={handleBack}
										>
											Prev
										</Button>
										<Button className="pointer-events-none">{`${activeStep}/${course.totalSteps}`}</Button>
										<Button
											endIcon={<FuseSvgIcon>lucide:arrow-right</FuseSvgIcon>}
											onClick={handleNext}
										>
											Next
										</Button>
									</ButtonGroup>
								</div>
							)}

							{isMobile && (
								<Paper
									className="shadow-0 sticky bottom-0 z-10 flex w-full items-center border-b-1 px-4 py-2"
									square
								>
									<IconButton
										onClick={() => setLeftSidebarOpen(true)}
										aria-label="open left sidebar"
										size="large"
									>
										<FuseSvgIcon>lucide:menu</FuseSvgIcon>
									</IconButton>

									<Typography className="mx-2">{`${activeStep}/${course.totalSteps}`}</Typography>

									<CourseProgress
										className="mx-2 flex flex-1"
										course={course}
									/>

									<IconButton onClick={handleBack}>
										<FuseSvgIcon>lucide:arrow-left</FuseSvgIcon>
									</IconButton>

									<IconButton onClick={handleNext}>
										<FuseSvgIcon>lucide:arrow-right</FuseSvgIcon>
									</IconButton>
								</Paper>
							)}
						</div>
					</div>
				</>
			}
			leftSidebarProps={{
				open: leftSidebarOpen,
				onClose: () => {
					setLeftSidebarOpen(false);
				},
				width: 300,
				content: (
					<>
						<div className="p-8 pt-2">
							<Button
								to="/apps/academy/courses"
								component={Link}
								className="mb-4"
								color="secondary"
								variant="text"
								startIcon={
									<FuseSvgIcon>
										{theme.direction === 'ltr' ? 'lucide:arrow-left' : 'lucide:arrow-right'}
									</FuseSvgIcon>
								}
							>
								Back to courses
							</Button>

							<CourseInfo course={course} />
						</div>
						<Divider />
						<Stepper
							classes={{ root: 'p-8' }}
							activeStep={activeStep - 1}
							orientation="vertical"
						>
							{courseSteps?.map((step, index) => {
								return (
									<Step
										key={index}
										sx={{
											'& .MuiStepLabel-root, & .MuiStepContent-root': {
												cursor: 'pointer!important'
											},
											'& .MuiStepContent-root': {
												color: 'text.secondary'
											}
										}}
										onClick={() => handleStepChange(step.order)}
										expanded
									>
										<StepLabel
											className="font-medium"
											sx={{
												'& .MuiSvgIcon-root': {
													color: 'background.default',
													'& .MuiStepIcon-text': {
														fill: (_theme) => _theme.vars.palette.text.secondary
													},
													'&.Mui-completed': {
														color: 'secondary.main',
														'& .MuiStepIcon-text ': {
															fill: (_theme) => _theme.vars.palette.secondary.contrastText
														}
													},
													'&.Mui-active': {
														color: 'secondary.main',
														'& .MuiStepIcon-text ': {
															fill: (_theme) => _theme.vars.palette.secondary.contrastText
														}
													}
												}
											}}
										>
											{step.title}
										</StepLabel>
										<StepContent>{step.subtitle}</StepContent>
									</Step>
								);
							})}
						</Stepper>
					</>
				)
			}}
			scroll="content"
			ref={pageLayout}
			contentScrollbarsProps={{
				scrollToTopOnChildChange: true
			}}
		/>
	);
}

export default CourseView;
