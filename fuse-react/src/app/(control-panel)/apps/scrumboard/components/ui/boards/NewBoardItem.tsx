import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { useCreateScrumboardBoard } from '../../../api/hooks/boards/useCreateScrumboardBoard';

/**
 * The new board item component.
 */
function NewBoardItem() {
	const { mutate: createNewBoard } = useCreateScrumboardBoard();

	function handleNewBoard() {
		createNewBoard({});
	}

	return (
		<Box
			sx={{
				borderColor: 'divider'
			}}
			className="hover:bg-hover flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors duration-150 ease-in-out"
			onClick={handleNewBoard}
			onKeyDown={handleNewBoard}
			role="button"
			tabIndex={0}
		>
			<FuseSvgIcon
				size={48}
				color="disabled"
			>
				lucide:plus
			</FuseSvgIcon>
		</Box>
	);
}

export default NewBoardItem;
