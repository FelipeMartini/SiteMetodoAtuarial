import { FormControl, InputLabel, Select, MenuItem, Typography, Box } from '@mui/material';

const sizeOptions = [
	{ value: '1024x1024', label: '1024 x 1024' },
	{ value: '1792x1024', label: '1792 x 1024' },
	{ value: '1024x1792', label: '1024 x 1792' }
];
type SizeFormControllerProps = {
	value: string;
	onChange: (value: string) => void;
	ref?: React.Ref<HTMLSelectElement>;
};

function SizeFormController(props: SizeFormControllerProps) {
	const { value, onChange, ref } = props;

	return (
		<FormControl fullWidth>
			<InputLabel>Size</InputLabel>
			<Select
				ref={ref}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				label="Size"
			>
				{sizeOptions.map((size) => (
					<MenuItem
						key={size.value}
						value={size.value}
					>
						<div className="space-between flex w-full items-center">
							<Typography className="flex-1">{size.label}</Typography>
							<Box
								className="h-5 rounded-sm border border-gray-300"
								sx={{
									aspectRatio: size.label.replace('x', '/'),
									backgroundColor: 'divider'
								}}
							/>
						</div>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export default SizeFormController;
