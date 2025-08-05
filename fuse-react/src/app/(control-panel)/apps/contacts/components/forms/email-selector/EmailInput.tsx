import TextField from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContactEmail } from '../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

// Define schema for validation
const schema = z.object({
	email: z.string().email('Invalid email').min(1, 'You must enter an email'),
	label: z.string().optional()
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	email: '',
	label: ''
};

type EmailInputProps = {
	value: ContactEmail;
	onChange: (T: ContactEmail) => void;
	onRemove: (T: ContactEmail) => void;
	hideRemove?: boolean;
};

/**
 * The email input.
 */
function EmailInput(props: EmailInputProps) {
	const { value, hideRemove = false, onChange, onRemove } = props;

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'all',
		defaultValues,
		resolver: zodResolver(schema)
	});

	useEffect(() => {
		reset(value);
	}, [reset, value]);

	const { errors } = formState;

	function handleFormSubmit(data: FormType): void {
		const { email, label } = data;

		// Use explicit type casting to validated against the ContactEmail type.
		onChange({
			email,
			label
		});
	}

	return (
		<form
			className="mb-4 flex items-end gap-2"
			onChange={handleSubmit(handleFormSubmit)}
		>
			<Controller
				control={control}
				name="email"
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="email">Email</FormLabel>
						<TextField
							{...field}
							id="email"
							placeholder="Email"
							variant="outlined"
							fullWidth
							error={!!errors.email}
							helperText={errors?.email?.message}
							slotProps={{
								input: {
									startAdornment: <FuseSvgIcon>lucide:mail</FuseSvgIcon>
								}
							}}
						/>
					</FormControl>
				)}
			/>
			<Controller
				control={control}
				name="label"
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="label">Label</FormLabel>
						<TextField
							{...field}
							id="label"
							placeholder="Label"
							variant="outlined"
							fullWidth
							error={!!errors.label}
							helperText={errors?.label?.message}
							slotProps={{
								input: {
									startAdornment: <FuseSvgIcon>lucide:tag</FuseSvgIcon>
								}
							}}
						/>
					</FormControl>
				)}
			/>
			{!hideRemove && (
				<IconButton
					onClick={() => {
						onRemove(value);
					}}
				>
					<FuseSvgIcon>lucide:trash</FuseSvgIcon>
				</IconButton>
			)}
		</form>
	);
}

export default EmailInput;
