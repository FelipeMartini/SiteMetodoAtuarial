import { OutlinedInput } from '@mui/material';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useNotesAppContext } from '../../contexts/NotesAppContext/useNotesAppContext';

/**
 * The notes search.
 */
function NotesSearch() {
	const { searchText, setSearchText } = useNotesAppContext();

	return (
		<motion.div
			className="flex flex-auto sm:grow-0"
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
		>
			<OutlinedInput
				className="flex w-full flex-1 items-center rounded-lg sm:max-w-64"
				placeholder="Search note"
				fullWidth
				startAdornment={<FuseSvgIcon color="disabled">lucide:search</FuseSvgIcon>}
				slotProps={{
					input: {
						'aria-label': 'Search'
					}
				}}
				value={searchText}
				onChange={(ev) => setSearchText(ev)}
			/>
		</motion.div>
	);
}

export default NotesSearch;
