import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ItemIcon from './ItemIcon';
import { FileManagerItem } from '../../api/types';
import { useFileManagerAppContext } from '../../contexts/FileManagerAppContext/useFileManagerAppContext';

type FileItemProps = {
	item: FileManagerItem;
};

/**
 * The file item.
 */
function FileItem(props: FileItemProps) {
	const { item } = props;
	const { setSelectedItemId } = useFileManagerAppContext();

	if (!item) {
		return null;
	}

	return (
		<Box
			className="relative flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-xl border-1 p-2 shadow-xs"
			onClick={() => setSelectedItemId(item.id)}
		>
			<ItemIcon type={item.type} />
			<div className="flex w-full shrink flex-col justify-center text-center">
				<Typography className="text-md truncate font-medium">{item.name}</Typography>
				{item.contents && (
					<Typography
						className="text-md w-full truncate font-medium"
						color="text.secondary"
					>
						{item.contents}
					</Typography>
				)}
			</div>
		</Box>
	);
}

export default FileItem;
