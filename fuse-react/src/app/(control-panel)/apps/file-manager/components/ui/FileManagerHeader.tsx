import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@fuse/core/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import useFileManagerData from '../../hooks/useFileManagerData';

/**
 * The file manager header.
 */
function FileManagerHeader() {
	const { folders, files, path } = useFileManagerData();

	return (
		<div className="container flex w-full py-4">
			<div className="flex flex-auto flex-col">
				<PageBreadcrumb className="mb-2" />
				<div className="flex min-w-0 flex-auto items-center gap-2">
					<div className="flex flex-auto flex-col">
						<motion.span
							className="flex items-end"
							initial={{ x: -20 }}
							animate={{ x: 0, transition: { delay: 0.2 } }}
						>
							<Typography
								component={Link}
								to="/apps/file-manager"
								className="text-2xl font-extrabold tracking-tight md:text-4xl"
								role="button"
							>
								File Manager
							</Typography>

							{path && path?.length > 0 && (
								<Breadcrumbs
									aria-label="file-manager-breadcrumb"
									separator={<NavigateNextIcon fontSize="small" />}
								>
									<div />
									{path?.map((item, index) =>
										index + 1 === path.length ? (
											<Typography key={index}>{item?.name}</Typography>
										) : (
											<Link
												key={index}
												to={`/apps/file-manager/${item?.id}`}
											>
												{item?.name}
											</Link>
										)
									)}
								</Breadcrumbs>
							)}
						</motion.span>
						<motion.span
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						>
							<Typography
								className="font-medium"
								color="text.secondary"
							>
								{`${folders.length} folders, ${files.length} files`}
							</Typography>
						</motion.span>
					</div>

					<div className="flex items-center">
						<Button
							className="whitespace-nowrap"
							variant="contained"
							color="secondary"
							startIcon={<FuseSvgIcon>lucide:plus</FuseSvgIcon>}
						>
							Upload file
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FileManagerHeader;
