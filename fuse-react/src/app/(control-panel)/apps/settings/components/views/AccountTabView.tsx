'use client';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { z } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TextField from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import _ from 'lodash';
import { useEffect } from 'react';
import { useAccountSettings } from '../../api/hooks/account/useAccountSettings';
import { useUpdateAccountSettings } from '../../api/hooks/account/useUpdateAccountSettings';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const defaultValues: FormType = {
	id: '',
	name: '',
	username: '',
	title: '',
	company: '',
	about: '',
	email: '',
	phone: '',
	country: '',
	language: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	id: z.string().min(1, 'ID is required'),
	name: z.string().min(1, 'Name is required'),
	username: z.string().min(1, 'Username is required'),
	title: z.string().min(1, 'Title is required'),
	company: z.string().min(1, 'Company is required'),
	about: z.string().min(1, 'About is required'),
	email: z.string().email('Invalid email').min(1, 'Email is required'),
	phone: z.string().min(1, 'Phone is required'),
	country: z.string().min(1, 'Country is required'),
	language: z.string().min(1, 'Language is required')
});

type FormType = z.infer<typeof schema>;

function AccountTabView() {
	const { data: accountSettings } = useAccountSettings();
	const { mutate: updateAccountSettings } = useUpdateAccountSettings();

	const { control, reset, handleSubmit, formState } = useForm<FormType>({
		defaultValues,
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	useEffect(() => {
		reset(accountSettings);
	}, [accountSettings, reset]);

	/**
	 * Form Submit
	 */
	function onSubmit(formData: FormType) {
		updateAccountSettings(formData);
	}

	return (
		<div className="w-full max-w-5xl">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex w-full flex-col gap-12"
			>
				<div className="flex flex-col gap-4">
					<div className="w-full">
						<Typography className="text-xl font-medium">Profile</Typography>
						<Typography color="text.secondary">
							Following information is publicly displayed, be careful!
						</Typography>
					</div>

					<div className="grid w-full gap-4 sm:grid-cols-4">
						<div className="sm:col-span-4">
							<Controller
								control={control}
								name="name"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="name">Name</FormLabel>
										<TextField
											{...field}
											placeholder="Name"
											id="name"
											error={!!errors.name}
											helperText={errors?.name?.message}
											required
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:circle-user</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="sm:col-span-4">
							<Controller
								control={control}
								name="username"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="username">Username</FormLabel>
										<TextField
											{...field}
											placeholder="Username"
											id="username"
											error={!!errors.username}
											helperText={errors?.username?.message}
											variant="outlined"
											required
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<Typography
															color="text.secondary"
															className="italic"
														>
															fusetheme.com/
														</Typography>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="sm:col-span-2">
							<Controller
								control={control}
								name="title"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="title">Title</FormLabel>
										<TextField
											className=""
											{...field}
											placeholder="Job title"
											id="title"
											error={!!errors.title}
											helperText={errors?.title?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:briefcase</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="sm:col-span-2">
							<Controller
								control={control}
								name="company"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="company">Company</FormLabel>
										<TextField
											{...field}
											placeholder="Company"
											id="company"
											error={!!errors.company}
											helperText={errors?.company?.message}
											variant="outlined"
											fullWidth
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:building-2</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="sm:col-span-4">
							<Controller
								control={control}
								name="about"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="about">Notes</FormLabel>
										<TextField
											className=""
											{...field}
											placeholder="Notes"
											id="about"
											error={!!errors.about}
											variant="outlined"
											fullWidth
											multiline
											minRows={5}
											maxRows={10}
											slotProps={{
												input: {
													className: 'items-start gap-2',
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
											helperText={
												<span className="flex flex-col">
													<span>
														Brief description for your profile. Basic HTML and Emoji are
														allowed.
													</span>
													<span>{errors?.about?.message}</span>
												</span>
											}
										/>
									</FormControl>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="flex w-full flex-col gap-4">
					<div className="w-full">
						<Typography className="text-xl font-medium">Personal Information</Typography>
						<Typography color="text.secondary">
							Communication details in case we want to connect with you. These will be kept private.
						</Typography>
					</div>
					<div className="grid w-full gap-4 sm:grid-cols-4">
						<div className="sm:col-span-2">
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
													startAdornment: (
														<FuseSvgIcon color="action">lucide:mail</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="sm:col-span-2">
							<Controller
								control={control}
								name="phone"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="phone">Phone Number</FormLabel>
										<TextField
											{...field}
											id="phone"
											placeholder="Phone Number"
											variant="outlined"
											fullWidth
											error={!!errors.phone}
											helperText={errors?.phone?.message}
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:phone</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="sm:col-span-2">
							<Controller
								control={control}
								name="country"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="country">Country</FormLabel>
										<TextField
											{...field}
											id="country"
											placeholder="County"
											variant="outlined"
											fullWidth
											error={!!errors.country}
											helperText={errors?.country?.message}
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:flag</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
						<div className="sm:col-span-2">
							<Controller
								control={control}
								name="language"
								render={({ field }) => (
									<FormControl className="w-full">
										<FormLabel htmlFor="language">Language</FormLabel>
										<TextField
											{...field}
											id="language"
											placeholder="Language"
											variant="outlined"
											fullWidth
											error={!!errors.language}
											helperText={errors?.language?.message}
											slotProps={{
												input: {
													startAdornment: (
														<FuseSvgIcon color="action">lucide:globe</FuseSvgIcon>
													)
												}
											}}
										/>
									</FormControl>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2">
					<Button
						variant="outlined"
						disabled={_.isEmpty(dirtyFields)}
						onClick={() => reset(accountSettings)}
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

export default AccountTabView;
