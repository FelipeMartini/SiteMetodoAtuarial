import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chip from '@mui/material/Chip';
import _ from 'lodash';
import { ScrumboardCard } from '../../../../api/types';

type BoardCardCheckItemsProps = {
	card: ScrumboardCard;
};

/**
 * The board card check items component.
 */
function BoardCardCheckItems(props: BoardCardCheckItemsProps) {
	const { card } = props;

	const checkItemsChecked = getCheckItemsChecked(card);
	const checkItems = getCheckItems(card);

	function getCheckItemsChecked(_card: ScrumboardCard) {
		return _.sum(_card.checklists.map((list) => _.sum(list.checkItems.map((x) => (x.checked ? 1 : 0)))));
	}

	function getCheckItems(_card: ScrumboardCard) {
		return _.sum(_card.checklists.map((x) => x.checkItems.length));
	}

	if (checkItems === 0) {
		return null;
	}

	return (
		<Chip
			size="small"
			className={clsx(
				'text-md mx-1 mb-1.5 flex items-center font-semibold',
				checkItemsChecked === checkItems ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
			)}
			sx={{
				'& .MuiChip-icon': {
					color: 'inherit'
				}
			}}
			icon={
				<FuseSvgIcon
					size={16}
					color="inherit"
				>
					lucide:check
				</FuseSvgIcon>
			}
			label={`${checkItemsChecked}/${checkItems}`}
		/>
	);
}

export default BoardCardCheckItems;
