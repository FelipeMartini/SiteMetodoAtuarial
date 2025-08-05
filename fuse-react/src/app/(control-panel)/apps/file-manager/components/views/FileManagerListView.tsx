'use client';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { motion } from 'motion/react';
import FuseLoading from '@fuse/core/FuseLoading';
import FolderItem from '../ui/FolderItem';
import FileItem from '../ui/FileItem';
import useFileManagerData from '../../hooks/useFileManagerData';

/**
 * The file manager list.
 */
function FileManagerListView() {
	const { folders, files, isLoading } = useFileManagerData();

	if (isLoading) {
		return <FuseLoading />;
	}

	if (files.length === 0 && folders.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex h-full flex-1 items-center justify-center"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no items!
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="flex flex-col gap-8 p-4 md:p-8">
			{folders?.length > 0 && (
				<Box className="flex flex-col gap-2">
					<Typography className="font-semibold">Folders</Typography>
					<div className="flex flex-wrap gap-3">
						{folders.map((item) => (
							<FolderItem
								key={item.id}
								item={item}
							/>
						))}
					</div>
				</Box>
			)}
			{files.length > 0 && (
				<Box className="flex flex-col gap-2">
					<Typography className="font-semibold">Files</Typography>
					<div className="flex flex-wrap gap-3">
						{files.map((item) => (
							<FileItem
								key={item.id}
								item={item}
							/>
						))}
					</div>
				</Box>
			)}
		</div>
	);
}

export default FileManagerListView;
