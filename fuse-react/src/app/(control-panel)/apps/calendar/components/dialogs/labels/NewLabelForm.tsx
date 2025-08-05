import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import { PartialDeep } from 'type-fest';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LabelModel from '../../../api/models/LabelModel';
import { CalendarLabel } from '../../../api/types';
import { useCreateLabel } from '../../../api/hooks/labels/useCreateLabel';

const defaultValues = LabelModel();

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a label title'),
	color: z.string().optional()
});

/**
 * The new label form.
 */
function NewLabelForm() {
	const { mutate: createLabel } = useCreateLabel();

	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(data: PartialDeep<CalendarLabel>) {
		const newLabel = LabelModel(data);

		createLabel(newLabel);

		reset(defaultValues);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ListItem
				className="mb-2 p-0"
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
									startAdornment: (
										<Controller
											name="color"
											control={control}
											render={({ field: { onChange: _onChange, value: _value } }) => (
												<FormLabel className="flex items-center">
													<FuseSvgIcon>lucide:tag</FuseSvgIcon>
													<Input
														value={_value}
														onChange={(ev) => {
															_onChange(ev.target.value);
														}}
														type="color"
														className="opacity-0"
													/>
												</FormLabel>
											)}
										/>
									),
									endAdornment: (
										<IconButton
											className="p-0"
											aria-label="Delete"
											disabled={_.isEmpty(dirtyFields) || !isValid}
											type="submit"
											size="small"
										>
											<FuseSvgIcon color="action">lucide:check</FuseSvgIcon>
										</IconButton>
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
