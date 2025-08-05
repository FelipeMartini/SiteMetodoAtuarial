'use client';

import Button from '@mui/material/Button';
import Link from '@fuse/core/Link';
import useParams from '@fuse/hooks/useParams';
import { useCallback, useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import useNavigate from '@fuse/hooks/useNavigate';
import ContactEmailSelector from './email-selector/ContactEmailSelector';
import PhoneNumberSelector from './phone-number-selector/PhoneNumberSelector';
import ContactModel from '../../api/models/ContactModel';
import { ContactEmailModel, ContactPhoneModel } from '../../api/models/ContactModel';
import { useContact } from '../../api/hooks/contacts/useContact';
import { useTags } from '../../api/hooks/tags/useTags';
import { Tag } from '../../api/types';
import { useCreateContact } from '../../api/hooks/contacts/useCreateContact';
import { useUpdateContact } from '../../api/hooks/contacts/useUpdateContact';
import { useDeleteContact } from '../../api/hooks/contacts/useDeleteContact';
import { useSnackbar } from 'notistack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function BirtdayIcon() {
	return <FuseSvgIcon>lucide:cake</FuseSvgIcon>;
}

/**
 * Form Validation Schema
 */

// Zod schema for ContactEmail
const ContactEmailSchema = z.object({
	email: z.string().min(1, { message: 'Email is required' }),
	label: z.string().optional()
});

// Zod schema for ContactPhoneNumber
const ContactPhoneNumberSchema = z.object({
	country: z.string().optional(),
	phoneNumber: z.string().optional(),
	label: z.string().optional()
});

const schema = z.object({
	avatar: z.string().optional(),
	background: z.string().optional(),
	name: z.string().min(1, { message: 'Name is required' }),
	emails: z.array(ContactEmailSchema),
	phoneNumbers: z.array(ContactPhoneNumberSchema).optional(),
	title: z.string().optional(),
	company: z.string().optional(),
	birthday: z.string().optional(),
	address: z.string().optional(),
	notes: z.string().optional(),
	tags: z.array(z.string()).optional()
});

type FormType = z.infer<typeof schema>;

type ContactFormProps = {
	isNew?: boolean;
};

/**
 * The contact form.
 */
function ContactForm(props: ContactFormProps) {
	const { isNew } = props;
	const navigate = useNavigate();
	const { enqueueSnackbar } = useSnackbar();
	const routeParams = useParams<{ contactId: string }>();
	const { contactId } = routeParams;

	const { data: contact, isError } = useContact(contactId);
	const { data: tags } = useTags();

	const { mutate: createContact } = useCreateContact();
	const { mutate: updateContact } = useUpdateContact();
	const { mutate: deleteContact } = useDeleteContact();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (isNew) {
			reset(ContactModel({}));
		} else {
			reset({ ...contact });
		}
		// eslint-disable-next-line
	}, [contact, reset, routeParams]);

	/**
	 * Form Submit
	 */
	const onSubmit = useCallback(() => {
		// Prepare form data with properly transformed fields
		const formData = {
			...form,
			emails: form.emails?.map((email) => ContactEmailModel(email)) || [],
			phoneNumbers: form.phoneNumbers?.map((phone) => ContactPhoneModel(phone)) || []
		};

		if (isNew) {
			const contact = ContactModel(formData);
			createContact(contact, {
				onSuccess: (action) => {
					navigate(`/apps/contacts/${action.id}`);
				}
			});
		} else {
			updateContact({ id: contact.id, name: formData.name, ...formData });
		}
		// eslint-disable-next-line
	}, [form]);

	function handleRemoveContact() {
		if (!contact) {
			return;
		}

		deleteContact(contact.id, {
			onSuccess: () => {
				navigate('/apps/contacts');
			}
		});
	}

	const background = watch('background');
	const name = watch('name');

	if (isError && !isNew) {
		setTimeout(() => {
			navigate('/apps/contacts');
			enqueueSnackbar('NOT FOUND', {
				variant: 'error'
			});
		}, 0);

		return null;
	}

	if (_.isEmpty(form)) {
		return <FuseLoading className="min-h-screen" />;
	}

	return (
		<>
			<div className="relative flex flex-auto flex-col items-center overflow-y-auto">
				<Box
					className="relative min-h-40 w-full px-8 sm:min-h-48 sm:px-12"
					sx={{
						backgroundColor: 'background.default'
					}}
				>
					{background && (
						<img
							className="absolute inset-0 h-full w-full object-cover"
							src={background}
							alt="user background"
						/>
					)}
				</Box>

				<div className="w-full px-6 pb-8 sm:px-12">
					<div className="-mt-16 flex w-full flex-auto items-end">
						<Controller
							control={control}
							name="avatar"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full"
								>
									<div className="absolute inset-0 z-10 bg-black/50" />
									<div className="absolute inset-0 z-20 flex items-center justify-center">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex cursor-pointer p-2"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];

																if (!file) {
																	return;
																}

																const reader: FileReader = new FileReader();

																reader.onload = () => {
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(
																				reader.result
																			)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};

																reader.onerror = reject;

																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();

														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">lucide:camera</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">lucide:trash</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="text-16 h-full w-full object-cover font-bold"
										src={value}
										alt={name}
									>
										{name?.charAt(0)}
									</Avatar>
								</Box>
							)}
						/>
					</div>
					<div className="flex flex-col gap-4">
						<Controller
							control={control}
							name="name"
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="name">Name</FormLabel>
									<TextField
										{...field}
										id="name"
										placeholder="Name"
										error={!!errors.name}
										helperText={errors?.name?.message}
										variant="outlined"
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
						<Controller
							control={control}
							name="tags"
							render={({ field: { onChange, value } }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="tags">Tags</FormLabel>
									<Autocomplete
										multiple
										id="tags"
										options={tags || []}
										disableCloseOnSelect
										getOptionLabel={(option) => option?.title}
										renderOption={(_props, option, { selected }) => (
											<li {..._props}>
												<Checkbox
													style={{ marginRight: 8 }}
													checked={selected}
												/>
												{option?.title}
											</li>
										)}
										value={value ? value?.map((id) => _.find(tags, { id })) : ([] as Tag[])}
										onChange={(_event, newValue) => {
											onChange(newValue?.map((item) => item?.id));
										}}
										fullWidth
										renderInput={(params) => (
											<TextField
												{...params}
												placeholder="Tags"
											/>
										)}
									/>
								</FormControl>
							)}
						/>

						<Controller
							control={control}
							name="title"
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="title">Title</FormLabel>
									<TextField
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
						<Controller
							control={control}
							name="emails"
							render={({ field }) => (
								<ContactEmailSelector
									{...field}
									value={field.value.map((email) => ContactEmailModel(email))}
									onChange={(val) => field.onChange(val)}
								/>
							)}
						/>

						<Controller
							control={control}
							name="phoneNumbers"
							render={({ field }) => (
								<PhoneNumberSelector
									{...field}
									error={!!errors.phoneNumbers}
									helperText={errors?.phoneNumbers?.message}
									value={field.value.map((phone) => ContactPhoneModel(phone))}
									onChange={(val) => field.onChange(val)}
								/>
							)}
						/>

						<Controller
							control={control}
							name="address"
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="address">Address</FormLabel>
									<TextField
										{...field}
										placeholder="Address"
										id="address"
										error={!!errors.address}
										helperText={errors?.address?.message}
										variant="outlined"
										fullWidth
										slotProps={{
											input: {
												startAdornment: <FuseSvgIcon color="action">lucide:map-pin</FuseSvgIcon>
											}
										}}
									/>
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="birthday"
							render={({ field: { value, onChange } }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="birthday">Birthday</FormLabel>
									<DateTimePicker
										value={new Date(value)}
										onChange={(val) => {
											onChange(val?.toISOString());
										}}
										slotProps={{
											textField: {
												id: 'birthday',
												fullWidth: true,
												size: 'small',
												variant: 'outlined',
												error: !!errors.birthday,
												helperText: errors?.birthday?.message
											},
											actionBar: {
												actions: ['clear', 'today']
											}
										}}
										slots={{
											openPickerIcon: BirtdayIcon
										}}
									/>
								</FormControl>
							)}
						/>
						<Controller
							control={control}
							name="notes"
							render={({ field }) => (
								<FormControl className="w-full">
									<FormLabel htmlFor="notes">Notes</FormLabel>
									<TextField
										{...field}
										placeholder="Notes"
										id="notes"
										error={!!errors.notes}
										helperText={errors?.notes?.message}
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
														color="action"
														className="mt-1"
													>
														lucide:align-left
													</FuseSvgIcon>
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
			<Box
				className="flex items-center border-t py-3.5 pr-4 pl-1 sm:pr-12 sm:pl-9"
				sx={{ backgroundColor: 'background.default' }}
			>
				{!isNew && (
					<Button
						color="error"
						onClick={handleRemoveContact}
					>
						Delete
					</Button>
				)}
				<Button
					component={Link}
					className="ml-auto"
					to={`/apps/contacts/${contactId}`}
				>
					Cancel
				</Button>
				<Button
					className="ml-2"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSubmit(onSubmit)}
				>
					Save
				</Button>
			</Box>
		</>
	);
}

export default ContactForm;
