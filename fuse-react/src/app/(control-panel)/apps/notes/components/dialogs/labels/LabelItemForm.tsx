import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect } from 'react';
import { useDebounce } from '@fuse/hooks';
import _ from 'lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { NotesLabel } from '../../../api/types';
import { useLabels } from '../../../api/hooks/labels/useLabels';
import LabelModel from '../../../api/models/LabelModel';
import { useUpdateLabel } from '../../../api/hooks/labels/useUpdateLabel';
import { useDeleteLabel } from '../../../api/hooks/labels/useDeleteLabel';

type LabelFormProps = {
	label: NotesLabel;
};

/**
 * The new label form.
 */
function NewLabelForm(props: LabelFormProps) {
	const { label } = props;
	const { data: labels } = useLabels();

	const { mutate: updateLabel } = useUpdateLabel();
	const { mutate: removeLabel } = useDeleteLabel();

	/**
	 * Form Validation Schema
	 */
	const schema = z.object({
		id: z.string().nonempty(),
		title: z
			.string()
			.nonempty('You must enter a label title')
			.refine(
				(title) => {
					// Check if title exists in labelListArray
					return !labels.some((label) => label.title === title);
				},
				{
					message: 'This label title already exists'
				}
			)
	});

	type FormType = z.infer<typeof schema>;

	const { control, formState, reset, watch } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: label,
		resolver: zodResolver(schema)
	});

	const { errors, dirtyFields, isValid } = formState;
	const watchedLabelForm = watch();

	useEffect(() => {
		reset(label);
	}, [label, reset]);

	/**
	 * On Change Handler
	 */
	const handleOnChange = useDebounce((_label: FormType) => {
		updateLabel(LabelModel({ ..._label, id: label.id }));
	}, 600);

	/**
	 * Update Note
	 */
	useEffect(() => {
		if (isValid && !_.isEmpty(dirtyFields) && !_.isEqual(label, watchedLabelForm)) {
			handleOnChange(watchedLabelForm);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watchedLabelForm, label, handleOnChange, dirtyFields]);

	function handleOnRemove() {
		removeLabel(label.id);
	}

	return (
		<ListItem
			className="mb-3 p-0"
			dense
		>
			<Controller
				name="title"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className={clsx('flex flex-1')}
						error={!!errors.title}
						helperText={errors?.title?.message}
						placeholder="Create new label"
						variant="outlined"
						slotProps={{
							input: {
								startAdornment: <FuseSvgIcon color="action">lucide:tag</FuseSvgIcon>,
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={handleOnRemove}
											className="p-0"
											aria-label="Delete"
											size="small"
										>
											<FuseSvgIcon color="action">lucide:trash</FuseSvgIcon>
										</IconButton>
									</InputAdornment>
								)
							}
						}}
					/>
				)}
			/>
		</ListItem>
	);
}

export default NewLabelForm;
