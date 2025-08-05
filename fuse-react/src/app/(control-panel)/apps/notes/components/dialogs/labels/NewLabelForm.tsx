import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LabelModel from '../../../api/models/LabelModel';
import { useCreateLabel } from '../../../api/hooks/labels/useCreateLabel';
import { useLabels } from '../../../api/hooks/labels/useLabels';

const defaultValues = {
	title: ''
};

/**
 * The new label form.
 */
function NewLabelForm() {
	const { mutate: createLabel } = useCreateLabel();
	const { data: labels } = useLabels();

	/**
	 * Form Validation Schema
	 */
	const schema = z.object({
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

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(data: FormType) {
		const newLabel = LabelModel(data);
		createLabel(newLabel);
		reset(defaultValues);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
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
												className="p-0"
												aria-label="Delete"
												disabled={_.isEmpty(dirtyFields) || !isValid}
												type="submit"
												size="small"
											>
												<FuseSvgIcon color="action">lucide:check</FuseSvgIcon>
											</IconButton>
										</InputAdornment>
									)
								}
							}}
						/>
					)}
				/>
			</ListItem>
		</form>
	);
}

export default NewLabelForm;
