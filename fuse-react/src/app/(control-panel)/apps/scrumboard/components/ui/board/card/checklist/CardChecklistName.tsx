import { useEffect, useImperativeHandle, useState, MouseEvent } from 'react';
import { Controller, useForm } from 'react-hook-form';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a title')
});

type FormType = z.infer<typeof schema>;

export type CardChecklistHandle = {
	openForm: (ev: React.MouseEvent<HTMLElement>) => void;
};

type CardChecklistNameProps = {
	name: string;
	onNameChange: (name: string) => void;
	ref?: React.RefObject<CardChecklistHandle>;
};

/**
 * The card checklist name component.
 */
function CardChecklistName(props: CardChecklistNameProps) {
	const { name, onNameChange, ref } = props;

	const [formOpen, setFormOpen] = useState(false);
	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues: {
			name
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	useEffect(() => {
		if (!formOpen) {
			reset({
				name
			});
		}
	}, [formOpen, reset, name]);

	useImperativeHandle(ref, () => {
		return {
			openForm: (ev) => handleOpenForm(ev)
		};
	});

	function handleOpenForm(ev: React.MouseEvent<HTMLElement>) {
		ev.stopPropagation();
		setFormOpen(true);
	}

	function handleCloseForm() {
		setFormOpen(false);
	}

	function onSubmit(data: FormType) {
		onNameChange(data.name);
		handleCloseForm();
	}

	return formOpen ? (
		<ClickAwayListener onClickAway={handleCloseForm}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Controller
					name="name"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							variant="outlined"
							margin="dense"
							autoFocus
							slotProps={{
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												type="submit"
												disabled={_.isEmpty(dirtyFields) || !isValid}
												size="large"
											>
												<FuseSvgIcon>lucide:check</FuseSvgIcon>
											</IconButton>
										</InputAdornment>
									)
								}
							}}
						/>
					)}
				/>
			</form>
		</ClickAwayListener>
	) : (
		<Typography
			className="mx-2 cursor-pointer text-lg font-semibold"
			onClick={handleOpenForm}
		>
			{name}
		</Typography>
	);
}

export default CardChecklistName;
