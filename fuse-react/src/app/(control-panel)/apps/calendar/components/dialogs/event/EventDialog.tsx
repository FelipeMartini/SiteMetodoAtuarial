import { Controller, useForm } from 'react-hook-form';
import FuseUtils from '@fuse/utils/FuseUtils';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MouseEvent, useCallback, useEffect } from 'react';
import _ from 'lodash';
import { FormLabel, FormControl, Popover } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import EventLabelSelect, { EventLabelSelectProps } from '../../../components/ui/EventLabelSelect';
import EventModel from '../../../api/models/EventModel';
import { useCreateEvent } from '../../../api/hooks/events/useCreateEvent';
import { useDeleteEvent } from '../../../api/hooks/events/useDeleteEvent';
import { useUpdateEvent } from '../../../api/hooks/events/useUpdateEvent';
import { useLabels } from '../../../api/hooks/labels/useLabels';
import { useCalendarAppContext } from '../../../contexts/CalendarAppContext/useCalendarAppContext';

const defaultValues = EventModel();

/**
 * Form Validation Schema
 */
const schema = z.object({
	id: z.string().nonempty('You must enter an id'),
	title: z.string().nonempty('You must enter a title'),
	start: z.string().nonempty('Please enter start date'),
	end: z.string().optional(),
	allDay: z.boolean().optional(),
	extendedProps: z
		.object({
			desc: z.string().optional(),
			label: z.string().optional()
		})
		.optional()
});

type FormType = z.infer<typeof schema>;

/**
 * The event dialog.
 */
function EventDialog() {
	const { eventDialog, closeEditEventDialog, closeNewEventDialog } = useCalendarAppContext();
	const { data: labels } = useLabels();
	const firstLabelId = labels ? labels[0]?.id : null;
	const { mutate: createEvent } = useCreateEvent();
	const { mutate: updateEvent } = useUpdateEvent();
	const { mutate: deleteEvent } = useDeleteEvent();

	const { reset, formState, watch, control, getValues } = useForm<FormType>({
		defaultValues,
		mode: 'onChange',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const start = watch('start');
	const end = watch('end');
	const id = watch('id');

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (eventDialog.type === 'edit' && eventDialog.data) {
			reset({ ...eventDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (eventDialog.type === 'new') {
			reset({
				...defaultValues,
				...eventDialog.data,
				extendedProps: {
					...defaultValues.extendedProps,
					label: firstLabelId
				},
				id: FuseUtils.generateGUID()
			});
		}
		// eslint-disable-next-line
	}, [eventDialog.data, eventDialog.type, reset]);

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (eventDialog.props.open) {
			initDialog();
		}
	}, [eventDialog.props.open, initDialog]);

	/**
	 * Close Dialog
	 */
	function closeComposeDialog() {
		return eventDialog.type === 'edit' ? closeEditEventDialog() : closeNewEventDialog();
	}

	/**
	 * Form Submit
	 */
	function onSubmit(ev: MouseEvent<HTMLButtonElement>) {
		ev.preventDefault();
		const data = getValues();

		if (eventDialog.type === 'new') {
			createEvent(data);
		} else {
			// Ensure eventDialog.data exists for update
			if (eventDialog?.data) {
				updateEvent({ ...eventDialog.data, ...data });
			} else {
				console.error('Attempted to update event without existing data');
			}
		}

		closeComposeDialog();
	}

	/**
	 * Remove Event
	 */
	function handleRemove() {
		deleteEvent(id);
		closeComposeDialog();
	}

	return (
		<Popover
			{...eventDialog.props}
			open={eventDialog.props.open}
			anchorReference="anchorPosition"
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right'
			}}
			transformOrigin={{
				vertical: 'center',
				horizontal: 'left'
			}}
			onClose={closeComposeDialog}
			component="form"
		>
			<div className="flex w-120 max-w-full flex-col gap-4 p-6 pt-8 sm:p-8 sm:pt-10">
				<div className="flex gap-2">
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="title">Title</FormLabel>
								<TextField
									{...field}
									id="title"
									className="flex-auto"
									error={!!errors.title}
									helperText={errors?.title?.message}
									autoFocus
									required
									fullWidth
									slotProps={{
										input: {
											startAdornment: <FuseSvgIcon color="action">lucide:square-pen</FuseSvgIcon>
										}
									}}
								/>
							</FormControl>
						)}
					/>
				</div>

				<div className="flex gap-2">
					<div className="flex-column flex w-full min-w-0 flex-auto items-center gap-3 sm:flex-row">
						<Controller
							name="start"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="start">Start</FormLabel>
									<DateTimePicker
										className="flex min-w-0 flex-auto"
										value={new Date(value)}
										onChange={(val) => {
											onChange(val.toISOString());
										}}
										slotProps={{
											textField: {
												variant: 'outlined',
												size: 'small'
											}
										}}
										maxDate={new Date(end)}
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="end"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="end">End</FormLabel>
									<DateTimePicker
										className="flex min-w-0 flex-auto"
										value={new Date(value)}
										onChange={(val) => {
											onChange(val.toISOString());
										}}
										slotProps={{
											textField: {
												variant: 'outlined',
												size: 'small'
											}
										}}
										minDate={new Date(start)}
									/>
								</FormControl>
							)}
						/>

						<Controller
							name="allDay"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControlLabel
									className="m-0 flex min-w-0 flex-auto flex-shrink-0 whitespace-nowrap"
									label="All Day"
									labelPlacement="top"
									control={
										<Switch
											onChange={(ev) => {
												onChange(ev.target.checked);
											}}
											checked={value}
											name="allDay"
										/>
									}
								/>
							)}
						/>
					</div>
				</div>

				<div className="flex gap-2">
					<Controller
						name="extendedProps.label"
						control={control}
						render={({ field }) => <EventLabelSelect {...(field as unknown as EventLabelSelectProps)} />}
					/>
				</div>

				<div className="flex gap-2">
					<Controller
						name="extendedProps.desc"
						control={control}
						render={({ field }) => (
							<FormControl className="w-full">
								<FormLabel htmlFor="desc">Description</FormLabel>
								<TextField
									{...field}
									className=""
									id="desc"
									type="text"
									multiline
									rows={5}
									variant="outlined"
									fullWidth
									slotProps={{
										input: {
											className: 'items-start',
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

				{eventDialog.type === 'new' ? (
					<div className="flex items-center gap-2">
						<div className="flex flex-1" />
						<Button
							variant="contained"
							color="primary"
							onClick={onSubmit}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Add
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<div className="flex flex-1" />
						<IconButton onClick={handleRemove}>
							<FuseSvgIcon>lucide:trash</FuseSvgIcon>
						</IconButton>
						<Button
							variant="contained"
							color="primary"
							onClick={onSubmit}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Save
						</Button>
					</div>
				)}
			</div>
		</Popover>
	);
}

export default EventDialog;
