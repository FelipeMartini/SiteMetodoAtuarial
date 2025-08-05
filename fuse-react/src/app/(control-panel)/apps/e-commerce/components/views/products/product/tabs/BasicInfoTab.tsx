import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { Product } from '../../../../../api/types';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState } = methods;
	const { errors } = formState;

	return (
		<div className="flex flex-col gap-4">
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="name">Name</FormLabel>
						<TextField
							id="name"
							{...field}
							required
							autoFocus
							fullWidth
							error={!!errors.name}
							helperText={errors?.name?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="description">Description</FormLabel>
						<TextField
							{...field}
							id="description"
							type="text"
							multiline
							rows={3}
							fullWidth
							error={!!errors.description}
							helperText={errors?.description?.message as string}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="categories"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="categories">Categories</FormLabel>
						<Autocomplete
							multiple
							freeSolo
							options={[]}
							value={value as Product['categories']}
							onChange={(event, newValue) => {
								onChange(newValue);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select multiple categories"
									id="categories"
								/>
							)}
						/>
					</FormControl>
				)}
			/>

			<Controller
				name="tags"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<FormControl className="w-full">
						<FormLabel htmlFor="tags">Tags</FormLabel>
						<Autocomplete
							multiple
							freeSolo
							options={[]}
							value={value as Product['tags']}
							onChange={(event, newValue) => {
								onChange(newValue);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select multiple tags"
								/>
							)}
						/>
					</FormControl>
				)}
			/>
		</div>
	);
}

export default BasicInfoTab;
