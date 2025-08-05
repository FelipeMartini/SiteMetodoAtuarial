import Chip from '@mui/material/Chip';
import clsx from 'clsx';
import { getUnixTime } from 'date-fns/getUnixTime';
import { format } from 'date-fns/format';
import { fromUnixTime } from 'date-fns/fromUnixTime';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

type BoardCardDueDateProps = {
	dueDate: number;
};

/**
 * The board card due date component.
 */
function BoardCardDueDate(props: BoardCardDueDateProps) {
	const { dueDate } = props;

	if (!dueDate) {
		return null;
	}

	return (
		<Chip
			size="small"
			className={clsx(
				'text-md mx-1 mb-1.5 flex items-center font-semibold',
				getUnixTime(new Date()) > dueDate ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
			)}
			sx={{
				'& .MuiChip-icon': {
					color: 'inherit'
				}
			}}
			label={format(fromUnixTime(dueDate), 'MMM do yy')}
			icon={
				<FuseSvgIcon
					size={16}
					color="inherit"
				>
					lucide:clock
				</FuseSvgIcon>
			}
		/>
	);
}

export default BoardCardDueDate;
