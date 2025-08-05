'use client';

import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useEffect, useCallback, useMemo } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _, { debounce } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import IconButton from '@mui/material/IconButton';
import { useDeepCompareEffect } from '@fuse/hooks';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useParams from '@fuse/hooks/useParams';
import useNavigate from '@fuse/hooks/useNavigate';
import TaskPrioritySelector from './TaskPrioritySelector';
import FormActionsMenu from './FormActionsMenu';
import { Tag, Task } from '../../../api/types';
import { useUpdateTask } from '../../../api/hooks/tasks/useUpdateTask';
import { useCreateTask } from '../../../api/hooks/tasks/useCreateTask';
import SectionModel from '../../../api/models/SectionModel';
import TaskModel from '../../../api/models/TaskModel';
import { subTaskModel } from '../../../api/models/TaskModel';
import { useGetTask } from '../../../api/hooks/tasks/useGetTask';
import { useGetTags } from '../../../api/hooks/tags/useGetTags';
import { useSnackbar } from 'notistack';
import { FormLabel } from '@mui/material';
import { FormControl } from '@mui/material';
/**
 * Form Validation Schema
 */

const subTaskSchema = z.object({
	id: z.string().nonempty(),
	title: z.string().nonempty(),
	completed: z.boolean()
});

const schema = z.object({
	id: z.string().optional(),
	type: z.string().nonempty(),
	title: z.string().nonempty('You must enter a title'),
	notes: z.string().nullable().optional(),
	completed: z.boolean(),
	dueDate: z.string().nullable().optional(),
	priority: z.number(),
	tags: z.array(z.string()),
	assignedTo: z.string().nullable().optional(),
	subTasks: z.array(subTaskSchema).optional(),
	order: z.number()
});

type FormType = z.infer<typeof schema>;

/**
 * The task form.
 */
function TaskForm() {
	const routeParams = useParams<{ taskId: string; newTaskType: 'section' | 'task' }>();
	const taskId = routeParams?.taskId;
	const newTaskType = routeParams?.newTaskType;
	const isNew = taskId === 'new';
	const { enqueueSnackbar } = useSnackbar();

	const {
		data: task,
		isLoading: isTaskLoading,
		isError: isTaskError
	} = useGetTask(taskId, { enabled: !!taskId && !isNew });
	const { data: tags } = useGetTags();

	const { mutate: updateTask } = useUpdateTask();
	const { mutate: createTask } = useCreateTask();

	const navigate = useNavigate();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'onChange',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	/**
	 * Handle Auto Save
	 */
	const handleAutoSave = useCallback(
		(data: FormType) => {
			// Only save if the form is valid *at the time of execution*
			// and it's not a new task (new tasks use onSubmitNew)
			if (isValid && task && !isNew) {
				updateTask({
					taskId: task?.id,
					task: TaskModel({
						...data,
						title: data.title,
						subTasks: data.subTasks?.map((subTask) => subTaskModel(subTask))
					})
				});
			}
		},
		[isValid, task, isNew, updateTask]
	);

	// Create the debounced function
	const debouncedAutoSave = useMemo(() => debounce(handleAutoSave, 1000), [handleAutoSave]);

	/**
	 * Trigger Auto Save on Form Change
	 */
	useDeepCompareEffect(() => {
		if (!isNew && !_.isEmpty(dirtyFields)) {
			// Only trigger if it's not a new task and the form has been modified
			debouncedAutoSave(form);
		}

		// Cleanup function to cancel debounce on unmount or before next run
		return () => {
			debouncedAutoSave.cancel();
		};
	}, [form, isNew, dirtyFields, debouncedAutoSave]); // form is deep compared

	useEffect(() => {
		if (isNew) {
			if (newTaskType === 'section') {
				reset(SectionModel({}));
			}

			if (newTaskType === 'task') {
				reset(TaskModel({}));
			}
		} else {
			reset(task);
		}
	}, [reset, task, isNew, taskId, newTaskType]);

	/**
	 * Form Submit (for creating new task)
	 */
	function onSubmitNew(data: Task) {
		createTask(data, {
			onSuccess: (newTask) => {
				navigate(`/apps/tasks/${newTask?.id}`);
			},
			onError: (rejected) => {
				enqueueSnackbar(`Error creating task item ${rejected}`, {
					variant: 'error'
				});
			}
		});
	}

	if (isTaskLoading) {
		return <FuseLoading />;
	}

	if (!isNew && isTaskError) {
		setTimeout(() => {
			navigate('/apps/tasks');
			enqueueSnackbar('Task not found', {
				variant: 'error'
			});
		}, 0);

		return null;
	}

	return (
		<>
			<div className="relative flex flex-auto flex-col items-center gap-4 p-6 sm:p-12">
				<div className="flex w-full items-center justify-between">
					<Controller
						control={control}
						name="completed"
						render={({ field: { value, onChange } }) => (
							<Button
								className="font-semibold"
								onClick={() => onChange(!value)}
							>
								<Box
									sx={[
										value
											? {
													color: 'secondary.main'
												}
											: {
													color: 'text.disabled'
												}
									]}
								>
									<FuseSvgIcon>lucide:circle-check</FuseSvgIcon>
								</Box>
								<span className="mx-2">
									{task?.completed ? 'MARK AS INCOMPLETE' : 'MARK AS COMPLETE'}
								</span>
							</Button>
						)}
					/>
					<div className="flex items-center">
						{!isNew && <FormActionsMenu taskId={task?.id} />}
						<IconButton
							component={NavLinkAdapter}
							to="/apps/tasks"
							size="large"
						>
							<FuseSvgIcon>lucide:x</FuseSvgIcon>
						</IconButton>
					</div>
				</div>
				<Controller
					control={control}
					name="title"
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="title">{`${_.upperFirst(form.type)} title`}</FormLabel>
							<TextField
								{...field}
								placeholder="Job title"
								id="title"
								error={!!errors.title}
								helperText={errors?.title?.message}
								fullWidth
								multiline
								minRows={3}
								maxRows={10}
							/>
						</FormControl>
					)}
				/>
				<Controller
					control={control}
					name="tags"
					render={({ field: { onChange, value } }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="tags">Tags</FormLabel>
							<Autocomplete
								multiple
								id="tags"
								options={tags || []}
								disableCloseOnSelect
								getOptionLabel={(option: Tag) => option?.title}
								renderOption={(_props, option: Tag, { selected }) => (
									<li {..._props}>
										<Checkbox
											style={{ marginRight: 8 }}
											checked={selected}
										/>
										{option?.title}
									</li>
								)}
								value={value ? value.map((id) => _.find(tags, { id })) : []}
								onChange={(event, newValue) => {
									onChange(newValue.map((item: Tag) => item.id));
								}}
								fullWidth
								renderInput={(params) => (
									<TextField
										{...params}
										placeholder="Tags"
									/>
								)}
							/>
						</FormControl>
					)}
				/>
				<div className="flex w-full items-end gap-4">
					<Controller
						control={control}
						name="dueDate"
						render={({ field: { value, onChange } }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="due-date">Due date</FormLabel>
								<DateTimePicker
									className="w-full"
									value={new Date(value)}
									onChange={(val) => {
										onChange(val.toISOString());
									}}
									slotProps={{
										textField: {
											id: 'due-date',
											fullWidth: true,
											variant: 'outlined',
											size: 'small'
										},
										actionBar: {
											actions: ['clear', 'today']
										}
									}}
								/>
							</FormControl>
						)}
					/>
					<Controller
						control={control}
						name="priority"
						render={({ field }) => <TaskPrioritySelector {...field} />}
					/>
				</div>

				<Controller
					control={control}
					name="notes"
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="notes">Notes</FormLabel>
							<TextField
								{...field}
								placeholder="Notes"
								id="notes"
								error={!!errors.notes}
								helperText={errors?.notes?.message}
								fullWidth
								multiline
								minRows={5}
								maxRows={10}
								slotProps={{
									input: {
										className: 'items-start gap-2',
										startAdornment: (
											<FuseSvgIcon
												className="mt-1"
												color="action"
											>
												lucide:align-left
											</FuseSvgIcon>
										)
									}
								}}
							/>
						</FormControl>
					)}
				/>
			</div>
			{isNew && (
				<Box
					className="mt-10 flex items-center border-t py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9"
					sx={{ backgroundColor: 'background.default' }}
				>
					<Button
						onClick={() => {
							navigate(-1);
						}}
						className="ml-auto"
					>
						Cancel
					</Button>
					<Button
						className="ml-2"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={handleSubmit(onSubmitNew)}
					>
						Create
					</Button>
				</Box>
			)}
		</>
	);
}

export default TaskForm;
