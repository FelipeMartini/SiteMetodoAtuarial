import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useParams from '@fuse/hooks/useParams';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { format } from 'date-fns/format';
import { useDebounce } from '@fuse/hooks';
import FuseLoading from '@fuse/core/FuseLoading';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import NoteFormList from './tasks/NoteFormList';
import NoteFormLabelMenu from './NoteFormLabelMenu';
import NoteFormReminder from './NoteFormReminder';
import NoteFormUploadImage from './NoteFormUploadImage';
import NoteModel from '../../../api/models/NoteModel';
import NoteReminderLabel from '../../ui/NoteReminderLabel';
import NoteLabel from '../../ui/NoteLabel';
import { NotesNote } from '../../../api/types';
import NoteListItemModel from '../../../api/models/NoteListItemModel';
import { useNotesList } from '../../../api/hooks/notes/useNotesList';
import { useCreateNote } from '../../../api/hooks/notes/useCreateNote';
import { useDeleteNote } from '../../../api/hooks/notes/useDeleteNote';
import { useUpdateNote } from '../../../api/hooks/notes/useUpdateNote';
import { useNotesAppContext } from '../../../contexts/NotesAppContext/useNotesAppContext';
/**
 * Form Validation Schema
 */
const tasksSchema = z.object({
	id: z.string().nonempty('ID is required'),
	content: z.string().nonempty('Content is required'),
	completed: z.boolean()
});

const schema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	content: z.string().optional(),
	tasks: z.array(tasksSchema).default([]).optional(),
	labels: z.array(z.string()).default([]).optional(),
	image: z.string().nullable().optional(),
	reminder: z.string().nullable().optional(),
	archived: z.boolean().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	oneOfThemRequired: z
		.boolean()
		.optional()
		.refine(
			function (
				this: {
					parent: NotesNote;
				},
				value
			) {
				if (value === true) {
					// Now `this` is explicitly typed with `RefineContext`
					const { title, content, image, tasks } = this.parent;
					return title || content || image || (tasks && tasks.length > 0);
				}

				return true;
			},
			{
				message: 'At least one of the fields is required.'
			}
		)
});

type FormType = z.infer<typeof schema>;

type NoteFormProps = {
	variant?: 'new' | 'edit';
	note?: NotesNote;
	onClose?: () => void;
};

/**
 * The note form.
 */
function NoteForm(props: NoteFormProps) {
	const { variant = 'edit', onClose } = props;
	const [showList, setShowList] = useState(false);
	const routeParams = useParams() as {
		id: string;
		filter: string;
		labelId: string;
	};

	const { mutate: updateNote } = useUpdateNote();
	const { mutate: removeNote } = useDeleteNote();
	const { mutate: createNote } = useCreateNote();

	const { data: notes } = useNotesList();
	const { noteDialogId } = useNotesAppContext();

	const note = useMemo(() => _.find(notes, { id: noteDialogId }), [noteDialogId, notes]);

	const { formState, handleSubmit, getValues, watch, reset, setValue, control } = useForm<FormType>({
		mode: 'onChange',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	const watchedNoteForm = watch();

	const resetForm = useCallback(() => {
		if (variant === 'edit' && note) {
			reset(note);
		}

		if (variant === 'new' && _.isEmpty(watchedNoteForm)) {
			reset(
				NoteModel(
					_.merge(
						routeParams.labelId ? { labels: [routeParams.labelId] } : null,
						routeParams.id === 'archive' ? { archived: true } : null
					)
				)
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [variant, routeParams, note]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	/**
	 * Create New Note
	 */
	function handleNewNote(data: FormType) {
		createNote(
			NoteModel({
				...data,
				tasks: data.tasks?.map((task) => NoteListItemModel(task)),
				...(routeParams.filter === 'labels' ? { labels: [routeParams.id] } : {}),
				...(routeParams.filter === 'archive' ? { archived: true } : {})
			})
		);
		resetForm();
	}

	/**
	 * On Change Handler
	 */
	const handleOnChange = useDebounce((_note: FormType) => {
		updateNote(NoteModel({ ..._note, tasks: _note.tasks?.map((task) => NoteListItemModel(task)) }));
	}, 600);

	/**
	 * Update Note
	 */
	useEffect(() => {
		if (variant === 'edit' && !_.isEmpty(dirtyFields)) {
			if (!_.isEqual(note, watchedNoteForm)) {
				handleOnChange({
					...watchedNoteForm,
					tasks: watchedNoteForm.tasks?.map((task) => NoteListItemModel(task))
				});
			}
		}
	}, [watchedNoteForm, note, variant, handleOnChange, dirtyFields]);

	/**
	 * Delete  Note
	 */
	function handleOnRemove() {
		removeNote(note?.id);
		onClose?.();
	}

	if (_.isEmpty(watchedNoteForm)) {
		return <FuseLoading />;
	}

	return (
		<div className="flex w-full flex-col">
			<FuseScrollbars className="flex max-h-160 w-full flex-auto">
				<div className="w-full">
					<Controller
						name="image"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => {
							if (!value || value === '') {
								return <span />;
							}

							return (
								<div className="relative">
									<img
										src={value}
										className="block w-full"
										alt="note"
									/>
									<Fab
										className="absolute right-0 bottom-0 m-2"
										variant="extended"
										size="small"
										color="secondary"
										aria-label="Delete Image"
										type="button"
										onClick={() => onChange('')}
									>
										<FuseSvgIcon>lucide:trash</FuseSvgIcon>
									</Fab>
								</div>
							);
						}}
					/>

					<div className="mt-2 px-4">
						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									className="text-base font-semibold"
									placeholder="Title"
									type="text"
									disableUnderline
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="px-4">
						<Controller
							name="content"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									placeholder="Take a note..."
									multiline
									rows="4"
									disableUnderline
									fullWidth
								/>
							)}
						/>
					</div>

					<Controller
						name="tasks"
						control={control}
						defaultValue={[]}
						render={({ field: { onChange, value } }) => {
							if ((value?.length === 0 && !showList) || (!value && !showList)) {
								return <span />;
							}

							return (
								<div className="px-1">
									<NoteFormList
										tasks={value?.map((task) => NoteListItemModel(task)) || []}
										onCheckListChange={(val) => onChange(val)}
									/>
								</div>
							);
						}}
					/>

					{(watchedNoteForm.labels || watchedNoteForm.reminder || watchedNoteForm.createdAt) && (
						<div className="-mx-1 mb-3 flex w-full flex-wrap px-4">
							{watchedNoteForm.reminder && (
								<NoteReminderLabel
									className="mx-1 mt-1"
									date={watchedNoteForm.reminder}
									onDelete={() => {
										setValue('reminder', undefined);
									}}
								/>
							)}

							<Controller
								name="labels"
								control={control}
								defaultValue={[]}
								render={({ field: { onChange, value } }) => {
									if (!value) {
										return <span />;
									}

									return (
										<>
											{value.map((id) => (
												<NoteLabel
													id={id}
													key={id}
													className="mx-1 mt-1"
													onDelete={() => onChange(value.filter((_id) => _id !== id))}
												/>
											))}
										</>
									);
								}}
							/>

							{watchedNoteForm.createdAt && (
								<Typography
									color="text.secondary"
									className="text-md mx-1 mt-2"
								>
									Edited: {format(new Date(watchedNoteForm.createdAt), 'MMM dd yy, h:mm')}
								</Typography>
							)}
						</div>
					)}
				</div>
			</FuseScrollbars>

			<div className="flex flex-auto items-center justify-between px-4 pb-3">
				<div className="flex items-center">
					<Controller
						name="reminder"
						control={control}
						render={({ field: { onChange, value } }) => (
							<NoteFormReminder
								reminder={value}
								onChange={onChange}
							/>
						)}
					/>

					<Tooltip
						title="Add image"
						placement="bottom"
					>
						<div>
							<NoteFormUploadImage
								onChange={(val: string) =>
									setValue('image', val, { shouldDirty: true, shouldValidate: true })
								}
							/>
						</div>
					</Tooltip>

					<Tooltip
						title="Add tasks"
						placement="bottom"
					>
						<IconButton
							className="p-0"
							onClick={() => setShowList(!showList)}
							size="small"
						>
							<FuseSvgIcon>lucide:square-pen</FuseSvgIcon>
						</IconButton>
					</Tooltip>

					<Tooltip
						title="Change labels"
						placement="bottom"
					>
						<div>
							<NoteFormLabelMenu
								note={NoteModel({
									...watchedNoteForm,
									tasks: watchedNoteForm.tasks?.map((task) => NoteListItemModel(task))
								})}
								onChange={(labels: string[]) => setValue('labels', labels)}
							/>
						</div>
					</Tooltip>

					<Controller
						name="archived"
						control={control}
						defaultValue={false}
						render={({ field: { onChange, value } }) => (
							<Tooltip
								title={value ? 'Unarchive' : 'Archive'}
								placement="bottom"
							>
								<IconButton
									// disabled={newFormButtonDisabled()}
									onClick={() => {
										onChange(!value);

										if (variant === 'new') {
											setTimeout(() => handleNewNote(getValues()));
										}
									}}
									size="small"
								>
									<FuseSvgIcon>{value ? 'lucide:archive' : 'lucide:archive'}</FuseSvgIcon>
								</IconButton>
							</Tooltip>
						)}
					/>
				</div>

				<div className="flex items-center">
					{variant === 'new' ? (
						<Button
							className=""
							type="submit"
							variant="contained"
							color="secondary"
							size="small"
							onClick={handleSubmit(handleNewNote)}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Create
						</Button>
					) : (
						<>
							<Tooltip
								title="Delete Note"
								placement="bottom"
							>
								<IconButton
									className="p-0"
									onClick={handleOnRemove}
									size="small"
								>
									<FuseSvgIcon>lucide:trash</FuseSvgIcon>
								</IconButton>
							</Tooltip>
							<Button
								className=""
								onClick={onClose}
								variant="text"
							>
								Close
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default NoteForm;
