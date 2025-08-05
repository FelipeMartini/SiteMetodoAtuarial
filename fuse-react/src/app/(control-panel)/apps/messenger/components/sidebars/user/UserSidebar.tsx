import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import _ from 'lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import { PartialDeep } from 'type-fest/source/partial-deep';
import Statuses from '../../ui/Statuses';
import UserAvatar from '../../ui/UserAvatar';
import { Profile } from '../../../api/types';
import { useProfile } from '../../../api/hooks/profile/useProfile';
import { useUpdateProfile } from '../../../api/hooks/profile/useUpdateProfile';
import { useMessengerAppContext } from '../../../contexts/MessengerAppContext/useMessengerAppContext';

/**
 * The user sidebar.
 */
function UserSidebar() {
	const { setUserSidebarOpen } = useMessengerAppContext();

	const { data: user } = useProfile();
	const { mutateAsync: updateUserData } = useUpdateProfile();

	const { control, handleSubmit, reset, formState, watch } = useForm({});
	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		if (user) {
			reset(user);
		}
	}, [reset, user]);

	function onSubmit(data: PartialDeep<Profile, object>) {
		updateUserData(data);
	}

	const formValues = watch();

	if (!user || _.isEmpty(formValues)) {
		return null;
	}

	return (
		<div className="flex h-full flex-auto flex-col">
			<Box
				sx={(theme) => ({
					backgroundColor: lighten(theme.palette.background.default, 0.02),
					...theme.applyStyles('light', {
						backgroundColor: lighten(theme.palette.background.default, 0.4)
					})
				})}
			>
				<Toolbar className="flex items-center border-b-1 px-6">
					<IconButton onClick={() => setUserSidebarOpen(false)}>
						<FuseSvgIcon>lucide:arrow-left</FuseSvgIcon>
					</IconButton>
					<Typography className="px-2 text-2xl font-semibold">Profile</Typography>
				</Toolbar>
			</Box>
			<div className="flex flex-col items-center justify-center py-8">
				<UserAvatar
					className="text-16 h-40 w-40"
					user={user}
				/>
			</div>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4 px-6"
			>
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="name">Name</FormLabel>
							<TextField
								className="w-full"
								{...field}
								placeholder="Name"
								id="name"
								error={!!errors.name}
								helperText={errors?.name?.message as string}
								variant="outlined"
								required
								fullWidth
								slotProps={{
									input: {
										startAdornment: <FuseSvgIcon>lucide:circle-user</FuseSvgIcon>
									}
								}}
							/>
						</FormControl>
					)}
				/>

				<Controller
					control={control}
					name="email"
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="email">Email</FormLabel>
							<TextField
								{...field}
								placeholder="Email"
								fullWidth
								error={!!errors.email}
								helperText={errors?.email?.message as string}
								slotProps={{
									input: {
										startAdornment: <FuseSvgIcon color="action">lucide:mail</FuseSvgIcon>
									}
								}}
							/>
						</FormControl>
					)}
				/>

				<Controller
					name="about"
					control={control}
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="about">About</FormLabel>
							<TextField
								{...field}
								multiline
								rows={4}
								slotProps={{
									input: {
										className: 'items-start gap-2',
										startAdornment: (
											<FuseSvgIcon
												className="mt-1"
												color="action"
											>
												lucide:id-card
											</FuseSvgIcon>
										)
									}
								}}
							/>
						</FormControl>
					)}
				/>

				<FormControl
					component="fieldset"
					className="w-full"
				>
					<FormLabel component="legend">Status</FormLabel>
					<Controller
						name="status"
						control={control}
						render={({ field }) => (
							<RadioGroup
								{...field}
								aria-label="Status"
								name="status"
							>
								{Statuses.map((status) => (
									<FormControlLabel
										key={status.value}
										value={status.value}
										control={<Radio />}
										label={
											<div className="flex items-center">
												<Box
													className="h-2 w-2 rounded-full"
													sx={{ backgroundColor: status.color }}
												/>
												<span className="mx-2">{status.title}</span>
											</div>
										}
									/>
								))}
							</RadioGroup>
						)}
					/>
				</FormControl>
				<div className="mt-8 flex items-center justify-end">
					<Button className="mx-2">Cancel</Button>
					<Button
						className="mx-2"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={handleSubmit(onSubmit)}
					>
						Save
					</Button>
				</div>
			</form>
		</div>
	);
}

export default UserSidebar;
