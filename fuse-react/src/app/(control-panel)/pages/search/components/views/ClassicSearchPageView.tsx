'use client';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { blue, green } from '@mui/material/colors';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import exampleSearchResponse from '../../lib/constants/exampleSearchResponse';
import SearchItemType from '../../types/SearchItemType';

/**
 * The classic search page.
 */
function ClassicSearchPageView() {
	const [data, setData] = useState<SearchItemType[]>([]);

	useEffect(() => {
		setTimeout(() => {
			setData(exampleSearchResponse);
		}, 100);
	}, []);

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

	return (
		<FusePageSimple
			header={
				<div className="flex w-full max-w-xl flex-1 flex-col px-6 pt-6 sm:px-8 sm:pt-8">
					<PageBreadcrumb className="mb-2" />

					<Paper className="flex h-11 w-full items-center rounded-lg shadow-sm">
						<Input
							className="px-4"
							placeholder="Search..."
							disableUnderline
							fullWidth
							slotProps={{
								input: {
									'aria-label': 'Search'
								}
							}}
						/>
						<FuseSvgIcon
							className="mx-3"
							color="action"
						>
							lucide:search
						</FuseSvgIcon>
					</Paper>
				</div>
			}
			content={
				<div className="flex h-full w-full max-w-xl flex-auto flex-col p-6 pt-0 sm:p-8 sm:pt-0">
					<div className="flex flex-1 flex-col">
						{data.length > 0 && (
							<motion.div
								variants={container}
								initial="hidden"
								animate="show"
							>
								<motion.div variants={item}>
									<Typography
										color="text.secondary"
										className="text-md my-3"
									>
										{data.length} results
									</Typography>
								</motion.div>

								{data.map((_item) => (
									<motion.div
										variants={item}
										className="mb-7"
										key={_item.id}
									>
										<Typography
											className="cursor-pointer text-xl"
											sx={{
												color: blue[800]
											}}
										>
											{_item.title}
										</Typography>
										<Typography
											sx={{
												color: green[800]
											}}
										>
											{_item.url}
										</Typography>
										<Typography className="text-md">{_item.excerpt}</Typography>
									</motion.div>
								))}
							</motion.div>
						)}
					</div>

					<div className="mt-12 flex justify-center">
						<Pagination
							count={10}
							color="secondary"
						/>
					</div>
				</div>
			}
		/>
	);
}

export default ClassicSearchPageView;
