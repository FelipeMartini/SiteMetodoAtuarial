import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useLabels } from '../../api/hooks/labels/useLabels';
import FormLabel from '@mui/material/FormLabel';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

export type EventLabelSelectProps = {
	value: string;
	onChange: (value: string) => void;
	className?: string;
	ref?: React.RefObject<HTMLElement>;
};

/**
 * The event label select.
 */
function EventLabelSelect(props: EventLabelSelectProps) {
	const { value, onChange, className, ref } = props;
	const { data: labels } = useLabels();

	const handleChange = (event: SelectChangeEvent) => {
		onChange(event.target.value);
	};

	return (
		<FormControl
			fullWidth
			className={className}
		>
			<FormLabel htmlFor="label-select">Label</FormLabel>
			<Select
				id="label-select"
				value={value}
				onChange={handleChange}
				ref={ref}
				classes={{ select: 'flex items-center gap-3' }}
			>
				{labels?.map((label) => (
					<MenuItem
						value={label.id}
						key={label.id}
						className="gap-2"
					>
						<FuseSvgIcon sx={{ color: label.color }}>lucide:tag</FuseSvgIcon>

						<span>{label.title}</span>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export default EventLabelSelect;
