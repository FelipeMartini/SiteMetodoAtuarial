import Chip from '@mui/material/Chip';
import { format } from 'date-fns/format';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

type NoteLabelProps = {
	date: string;
	onDelete?: () => void;
	className?: string;
	classes?: {
		root?: string;
		label?: string;
		deleteIcon?: string;
	};
};

/**
 * The note label.
 */
function NoteLabel(props: NoteLabelProps) {
	const { date, onDelete, className, classes } = props;

	if (!date) {
		return null;
	}

	return (
		<Chip
			icon={<FuseSvgIcon>lucide:clock</FuseSvgIcon>}
			label={format(new Date(date), 'MMM dd yy, h:mm')}
			classes={{
				root: className,
				label: 'text-sm',
				...classes
			}}
			variant="outlined"
			onDelete={onDelete}
		/>
	);
}

export default NoteLabel;
