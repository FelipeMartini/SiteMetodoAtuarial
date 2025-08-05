import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

/**
 * The pricing tab.
 */
function PricingTab() {
	const methods = useFormContext();
	const { control } = methods;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="priceTaxExcl"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="priceTaxExcl">Tax Excluded Price</FormLabel>
						<TextField
							id="priceTaxExcl"
							{...field}
							slotProps={{
								input: {
									startAdornment: '$'
								}
							}}
							type="number"
							autoFocus
							fullWidth
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="priceTaxIncl"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="priceTaxIncl">Tax Included Price</FormLabel>
						<TextField
							id="priceTaxIncl"
							{...field}
							slotProps={{
								input: {
									startAdornment: '$'
								}
							}}
							type="number"
							fullWidth
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="taxRate"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="taxRate">Tax Rate</FormLabel>
						<TextField
							id="taxRate"
							{...field}
							slotProps={{
								input: {
									startAdornment: '$'
								}
							}}
							type="number"
							fullWidth
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="comparedPrice"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="comparedPrice">Compared Price</FormLabel>
						<TextField
							{...field}
							id="comparedPrice"
							slotProps={{
								input: {
									startAdornment: '$'
								}
							}}
							type="number"
							fullWidth
							helperText="Add a compare price to show next to the real price"
						/>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default PricingTab;
