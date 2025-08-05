'use client';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import TextField from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { useEffect } from 'react';
import { useSecuritySettings } from '../../api/hooks/security/useSecuritySettings';
import { useUpdateSecuritySettings } from '../../api/hooks/security/useUpdateSecuritySettings';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const defaultValues: FormType = {
	id: '',
	currentPassword: '',
	newPassword: '',
	twoStepVerification: false,
	askPasswordChange: false
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	id: z.string(),
	currentPassword: z.string(),
	newPassword: z.string().min(6, 'Password must be at least 6 characters').or(z.literal('')).optional(),
	twoStepVerification: z.boolean(),
	askPasswordChange: z.boolean()
});

type FormType = z.infer<typeof schema>;

function SecurityTabView() {
	const { data: securitySettings } = useSecuritySettings();
	const { mutate: updateSecuritySettings, isSuccess, error: updateError } = useUpdateSecuritySettings();

	const { control, setError, reset, handleSubmit, formState } = useForm<FormType>({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		reset(securitySettings);
	}, [securitySettings, reset]);

	useEffect(() => {
		reset({ ...securitySettings, currentPassword: '', newPassword: '' });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSuccess]);

	useEffect(() => {
		if (updateError) {
			setError('root', { type: 'manual', message: updateError.message });
		}
	}, [updateError, setError]);

	/**
	 * Form Submit
	 */
	function onSubmit(formData: FormType) {
		updateSecuritySettings({ ...formData, id: formData.id });
	}

	return (
		<div className="w-full max-w-5xl">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-12"
			>
				<div className="flex flex-col gap-4">
					<div className="w-full">
						<Typography className="text-xl font-medium">Change your password</Typography>
						<Typography color="text.secondary">
							You can only change your password twice within 24 hours!
						</Typography>
					</div>
					<div className="grid w-full gap-4 sm:grid-cols-4">
						<div className="sm:col-span-4">
							<Controller
								name="currentPassword"
								control={control}
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="currentPassword">
											Current password (default:changeme)
										</FormLabel>
										<TextField
											{...field}
											id="currentPassword"
											type="password"
											error={!!errors.currentPassword}
											helperText={errors?.currentPassword?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: <FuseSvgIcon color="action">lucide:key</FuseSvgIcon>
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="sm:col-span-4">
							<Controller
								name="newPassword"
								control={control}
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="newPassword">New password</FormLabel>
										<TextField
											{...field}
											id="newPassword"
											type="password"
											error={!!errors.newPassword}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: <FuseSvgIcon color="action">lucide:key</FuseSvgIcon>
												}
											}}
											helperText={errors?.newPassword?.message}
										/>
									</FormControl>
								)}
							/>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<div className="w-full">
						<Typography className="text-xl font-medium">Security preferences</Typography>
						<Typography color="text.secondary">
							Keep your account more secure with following preferences.
						</Typography>
					</div>
					<div className="grid w-full gap-4 sm:grid-cols-4">
						<div className="flex items-center justify-between sm:col-span-4">
							<Controller
								name="twoStepVerification"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{ root: 'm-0', label: 'flex flex-1' }}
											labelPlacement="start"
											label="Enable 2-step authentication"
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value || false}
													name="twoStepVerification"
												/>
											}
										/>
										<FormHelperText>
											Protects you against password theft by requesting an authentication code via
											SMS on every login.
										</FormHelperText>
									</div>
								)}
							/>
						</div>
						<div className="flex items-center justify-between sm:col-span-4">
							<Controller
								name="askPasswordChange"
								control={control}
								render={({ field: { onChange, value } }) => (
									<div className="flex w-full flex-col">
										<FormControlLabel
											classes={{
												root: 'm-0',
												label: 'flex flex-1'
											}}
											labelPlacement="start"
											label="Ask to change password on every 6 months"
											control={
												<Switch
													onChange={(ev) => {
														onChange(ev.target.checked);
													}}
													checked={value || false}
													name="askPasswordChange"
												/>
											}
										/>
										<FormHelperText>
											A simple but an effective way to be protected against data leaks and
											password theft.
										</FormHelperText>
									</div>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2">
					<Button
						variant="outlined"
						disabled={_.isEmpty(dirtyFields)}
						onClick={() => reset(securitySettings)}
					>
						Cancel
					</Button>
					<Button
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						type="submit"
					>
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}

export default SecurityTabView;
