import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'motion/react';
import ListSubheader from '@mui/material/ListSubheader';
import Typography from '@mui/material/Typography';
import { useProfileAlbums } from '../../../../api/hooks/useProfileAlbums';
import Album from './Album';

function Albums() {
	const { data: albums, isLoading } = useProfileAlbums();

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			{albums.map((album) => (
				<div
					key={album.id}
					className="mb-12"
				>
					<ListSubheader
						component={motion.div}
						variants={item}
						className="mb-6 flex items-center bg-transparent px-0"
					>
						<Typography className="text-2xl leading-[1.25] font-semibold">{album.name}</Typography>
						<Typography
							className="mx-3 leading-[1.25] font-medium"
							color="text.secondary"
						>
							{album.info}
						</Typography>
					</ListSubheader>

					<div className="-m-2 flex flex-wrap overflow-hidden">
						<Album album={album} />
					</div>
				</div>
			))}
		</motion.div>
	);
}

export default Albums;
