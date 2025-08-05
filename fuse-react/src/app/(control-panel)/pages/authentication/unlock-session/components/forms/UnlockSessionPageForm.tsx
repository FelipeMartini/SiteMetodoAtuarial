'use client';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from '@fuse/core/Link';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter your name'),
	password: z
		.string()
		.nonempty('Please enter your password.')
		.min(8, 'Password is too short - should be 8 chars minimum.')
});

const defaultValues = {
	name: 'Brian Hughes',
	password: ''
};

function UnlockSessionPageForm() {
	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit() {
		reset(defaultValues);
	}

	return (
		<form
			name="registerForm"
			noValidate
			className="mt-8 flex w-full flex-col justify-center gap-4"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<FormControl>
						<FormLabel htmlFor="name">Full name</FormLabel>
						<TextField
							id="name"
							{...field}
							autoFocus
							type="name"
							error={!!errors.name}
							helperText={errors?.name?.message}
							fullWidth
							disabled
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="password"
				control={control}
				render={({ field }) => (
					<FormControl>
						<FormLabel htmlFor="password">Password</FormLabel>
						<TextField
							id="password"
							{...field}
							type="password"
							error={!!errors.password}
							helperText={errors?.password?.message}
							required
							fullWidth
						/>
					</FormControl>
				)}
			/>

			<Button
				variant="contained"
				color="secondary"
				className="mt-1 w-full"
				aria-label="Register"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="medium"
			>
				Unlock your session
			</Button>

			<Typography
				className="text-md mt-2 font-medium"
				color="text.secondary"
			>
				I'm not <Link to="/sign-in">Brian Hughes</Link>
			</Typography>
		</form>
	);
}

export default UnlockSessionPageForm;
