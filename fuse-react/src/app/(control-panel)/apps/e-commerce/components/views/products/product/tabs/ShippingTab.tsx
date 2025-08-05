import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

/**
 * The shipping tab.
 */
function ShippingTab() {
	const methods = useFormContext();
	const { control } = methods;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-4">
				<Controller
					name="width"
					control={control}
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="width">Width</FormLabel>
							<TextField
								{...field}
								id="width"
								autoFocus
								fullWidth
							/>
						</FormControl>
					)}
				/>

				<Controller
					name="height"
					control={control}
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="height">Height</FormLabel>
							<TextField
								{...field}
								id="height"
								fullWidth
							/>
						</FormControl>
					)}
				/>

				<Controller
					name="depth"
					control={control}
					render={({ field }) => (
						<FormControl className="w-full">
							<FormLabel htmlFor="depth">Depth</FormLabel>
							<TextField
								id="depth"
								{...field}
								fullWidth
							/>
						</FormControl>
					)}
				/>
			</div>

			<Controller
				name="weight"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="weight">Weight</FormLabel>
						<TextField
							{...field}
							id="weight"
							fullWidth
						/>
					</FormControl>
				)}
			/>
			<Controller
				name="extraShippingFee"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="extraShippingFee">Extra Shipping Fee</FormLabel>
						<TextField
							{...field}
							id="extraShippingFee"
							slotProps={{
								input: {
									startAdornment: '$'
								}
							}}
							fullWidth
						/>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default ShippingTab;
