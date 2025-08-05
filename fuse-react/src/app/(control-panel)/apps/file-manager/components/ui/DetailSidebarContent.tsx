import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { useEffect } from 'react';
import usePathname from '@fuse/hooks/usePathname';
import useFileManagerData from '../../hooks/useFileManagerData';
import { useFileManagerAppContext } from '../../contexts/FileManagerAppContext/useFileManagerAppContext';
import ItemIcon from './ItemIcon';

/**
 * The detail sidebar content.
 */
function DetailSidebarContent() {
	const { selectedItem } = useFileManagerData();
	const { resetSelectedItemId } = useFileManagerAppContext();
	const pathname = usePathname();

	useEffect(() => {
		resetSelectedItemId();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname]);

	if (!selectedItem) {
		return null;
	}

	return (
		<motion.div
			initial={{ y: 50, opacity: 0.8 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.3 } }}
			className="file-details flex flex-col gap-8 p-6"
		>
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center gap-1">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1, transition: { delay: 0.3 } }}
					>
						<ItemIcon
							type={selectedItem.type}
							size={32}
						/>
					</motion.div>
					<Typography
						className="text-xl font-medium"
						color="text.secondary"
					>
						{selectedItem.name}
					</Typography>
				</div>
				<IconButton onClick={() => resetSelectedItemId()}>
					<FuseSvgIcon>lucide:x</FuseSvgIcon>
				</IconButton>
			</div>
			<div className="flex flex-col gap-2">
				<div className="text-lg font-medium">Information</div>
				<div className="flex flex-col divide-y border-t border-b font-medium">
					<div className="flex items-center justify-between py-3">
						<Typography color="text.secondary">Created By</Typography>
						<Typography>{selectedItem.createdBy}</Typography>
					</div>
					<div className="flex items-center justify-between py-3">
						<Typography color="text.secondary">Created At</Typography>
						<Typography>{selectedItem.createdAt}</Typography>
					</div>
					<div className="flex items-center justify-between py-3">
						<Typography color="text.secondary">Modified At</Typography>
						<Typography>{selectedItem.modifiedAt}</Typography>
					</div>
					<div className="flex items-center justify-between py-3">
						<Typography color="text.secondary">Size</Typography>
						<Typography>{selectedItem.size}</Typography>
					</div>
					{selectedItem.contents && (
						<div className="flex items-center justify-between py-3">
							<Typography color="text.secondary">Contents</Typography>
							<Typography>{selectedItem.contents}</Typography>
						</div>
					)}
				</div>
				{selectedItem.description && (
					<>
						<div className="mt-8 border-b pb-4 text-lg font-medium">Description</div>
						<Typography className="py-3">{selectedItem.description}</Typography>
					</>
				)}
				<div className="mt-4 flex w-full flex-wrap justify-end gap-2">
					<IconButton color="error">
						<FuseSvgIcon>lucide:trash</FuseSvgIcon>
					</IconButton>

					<Button
						color="secondary"
						variant="contained"
					>
						Download
					</Button>
				</div>
			</div>
		</motion.div>
	);
}

export default DetailSidebarContent;
