import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import { useGetScrumboardBoardLabel } from '../../../../api/hooks/labels/useGetScrumboardBoardLabel';

type BoardCardLabelProps = {
	id: string;
};

/**
 * The board card label component.
 */
function BoardCardLabel(props: BoardCardLabelProps) {
	const { id } = props;
	const { data: label } = useGetScrumboardBoardLabel(id);

	if (!label) {
		return null;
	}

	return (
		<Tooltip
			title={label.title}
			key={id}
		>
			<Chip
				className="text-md mx-1 mb-1.5 font-semibold"
				label={label.title}
				size="small"
			/>
		</Tooltip>
	);
}

export default BoardCardLabel;
