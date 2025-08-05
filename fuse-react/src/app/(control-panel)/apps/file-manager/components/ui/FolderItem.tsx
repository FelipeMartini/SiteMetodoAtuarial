import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import ItemIcon from './ItemIcon';
import { FileManagerItem } from '../../api/types';
import { useFileManagerAppContext } from '../../contexts/FileManagerAppContext/useFileManagerAppContext';

type FolderItemProps = {
	item: FileManagerItem;
};

/**
 * The folder item.
 */
function FolderItem(props: FolderItemProps) {
	const { item } = props;
	const { setSelectedItemId } = useFileManagerAppContext();

	if (!item) {
		return null;
	}

	return (
		<Box className="relative h-28 w-28 rounded-xl border-1 p-2 shadow-xs">
			<IconButton
				className="absolute top-0 right-0 z-20 m-1.5 h-4 min-h-4 w-4"
				onClick={() => setSelectedItemId(item.id)}
			>
				<FuseSvgIcon>lucide:info</FuseSvgIcon>
			</IconButton>
			<NavLinkAdapter
				className="flex h-full w-full flex-col items-center justify-center gap-0.5"
				to={`/apps/file-manager/${item.id}`}
				role="button"
			>
				<ItemIcon type={item.type} />
				<div className="flex shrink flex-col items-center">
					<Typography className="text-md truncate font-medium">{item.name}</Typography>
					{item.contents && (
						<Typography
							className="truncate text-xs font-medium"
							color="text.secondary"
						>
							{item.contents}
						</Typography>
					)}
				</div>
			</NavLinkAdapter>
		</Box>
	);
}

export default FolderItem;
