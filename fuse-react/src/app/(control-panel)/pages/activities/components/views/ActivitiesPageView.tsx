'use client';

import FusePageSimple from '@fuse/core/FusePageSimple';
import Typography from '@mui/material/Typography';
import Timeline from '@mui/lab/Timeline';
import PageBreadcrumb from 'src/components/PageBreadcrumb';
import exampleActivitiesData from '../../lib/constants/exampleActivitiesData';
import ActivityTimelineItem from '../ui/ActivityTimelineItem';

/**
 * The activities page.
 */
function ActivitiesPageView() {
	return (
		<FusePageSimple
			content={
				<div className="relative flex flex-1 flex-col p-4 md:p-8">
					<PageBreadcrumb className="mb-2" />
					<div className="flex flex-col">
						<Typography className="mb-1 text-3xl leading-none font-semibold tracking-tight">
							All Activities
						</Typography>
						<Typography
							className="text-md"
							color="text.secondary"
						>
							Application wide activities are listed here as individual items, starting with the most
							recent.
						</Typography>
					</div>

					<Timeline
						className="px-0 py-6"
						position="right"
						sx={{
							'& .MuiTimelineItem-root:before': {
								display: 'none'
							}
						}}
					>
						{exampleActivitiesData.map((item, index) => (
							<ActivityTimelineItem
								last={exampleActivitiesData.length === index + 1}
								item={item}
								key={item.id}
							/>
						))}
					</Timeline>
				</div>
			}
			scroll="page"
		/>
	);
}

export default ActivitiesPageView;
