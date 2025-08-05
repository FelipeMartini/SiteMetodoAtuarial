import TextField from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import CountryCodeSelector from './CountryCodeSelector';
import { ContactPhoneNumber } from '../../../api/types';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';

// Zod schema for ContactPhoneNumber
const schema = z.object({
	country: z.string().optional(),
	phoneNumber: z.string().optional(),
	label: z.string().optional()
});

type FormType = z.infer<typeof schema>;

const defaultValues: FormType = {
	country: '',
	phoneNumber: '',
	label: ''
};

type PhoneNumberInputProps = {
	value: ContactPhoneNumber;
	onChange: (T: ContactPhoneNumber) => void;
	onRemove: (T: ContactPhoneNumber) => void;
	hideRemove?: boolean;
	error?: boolean;
};

/**
 * The phone number input.
 */
function PhoneNumberInput(props: PhoneNumberInputProps) {
	const { value, hideRemove = false, onChange, onRemove } = props;

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'all',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { errors } = formState;

	useEffect(() => {
		reset(value);
	}, [reset, value]);

	function onSubmit(data: FormType) {
		const { country, phoneNumber, label } = data;
		onChange({
			country,
			phoneNumber,
			label
		});
	}

	return (
		<form
			className="mb-4 flex items-end gap-2"
			onChange={handleSubmit(onSubmit)}
		>
			<Controller
				control={control}
				name="phoneNumber"
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
						<TextField
							{...field}
							placeholder="Phone Number"
							variant="outlined"
							fullWidth
							error={!!errors.phoneNumber}
							helperText={errors?.phoneNumber?.message}
							slotProps={{
								input: {
									startAdornment: (
										<Controller
											control={control}
											name="country"
											render={({ field: _field }) => (
												<CountryCodeSelector
													{..._field}
													onChange={(val) => {
														_field.onChange(val);
														handleSubmit(onSubmit)();
													}}
												/>
											)}
										/>
									)
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
					onClick={(ev) => {
						ev.stopPropagation();
						onRemove(value);
					}}
				>
					<FuseSvgIcon>lucide:trash</FuseSvgIcon>
				</IconButton>
			)}
		</form>
	);
}

export default PhoneNumberInput;
