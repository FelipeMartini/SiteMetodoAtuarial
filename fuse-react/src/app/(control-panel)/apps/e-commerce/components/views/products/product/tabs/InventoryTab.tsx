import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';

/**
 * The inventory tab.
 */
function InventoryTab() {
	const methods = useFormContext();
	const { control } = methods;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="sku"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="sku">SKU</FormLabel>
						<TextField
							id="sku"
							{...field}
							required
							autoFocus
							fullWidth
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="quantity"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="quantity">Quantity</FormLabel>
						<TextField
							id="quantity"
							{...field}
							type="number"
							fullWidth
						/>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default InventoryTab;
