'use client';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import { SyntheticEvent, useState } from 'react';
import AboutTab from '../ui/tabs/about/AboutTab';
import PhotosVideosTab from '../ui/tabs/photos-videos/PhotosVideosTab';
import TimelineTab from '../ui/tabs/timeline/TimelineTab';
import { Tabs, Tab } from '@mui/material';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.vars.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.vars.palette.divider,
		'& > .container': {
			maxWidth: '100% !important'
		}
	}
}));

/**
 * The profile page.
 */
function ProfileAppView() {
	const [selectedTab, setSelectedTab] = useState('timeline');

	function handleTabChange(event: SyntheticEvent, value: string) {
		setSelectedTab(value);
	}

	return (
		<Root
			header={
				<div className="flex w-full flex-col">
					<img
						className="h-40 w-full object-cover lg:h-80"
						src="/assets/images/pages/profile/cover.jpg"
						alt="Profile Cover"
					/>

					<div className="mx-auto flex w-full max-w-7xl shrink-0 flex-col items-center px-8 lg:h-18 lg:flex-row">
						<div className="-mt-24 rounded-full lg:-mt-22">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1, transition: { delay: 0.1 } }}
							>
								<Avatar
									sx={{ borderColor: 'background.paper' }}
									className="h-32 w-32 border-4"
									src="/assets/images/avatars/male-04.jpg"
									alt="User avatar"
								/>
							</motion.div>
						</div>

						<div className="mt-4 flex flex-col items-center lg:mt-0 lg:ml-8 lg:items-start">
							<Typography className="text-lg leading-none font-bold">Brian Hughes</Typography>
							<Typography color="text.secondary">London, UK</Typography>
						</div>

						<div className="mx-8 hidden h-8 border-l-2 lg:flex" />

						<div className="mt-3 flex items-center gap-6 lg:mt-0">
							<div className="flex flex-col items-center">
								<Typography className="font-bold">200k</Typography>
								<Typography
									className="text-sm font-medium"
									color="text.secondary"
								>
									FOLLOWERS
								</Typography>
							</div>
							<div className="flex flex-col items-center">
								<Typography className="font-bold">1.2k</Typography>
								<Typography
									className="text-sm font-medium"
									color="text.secondary"
								>
									FOLLOWING
								</Typography>
							</div>
						</div>

						<div className="my-4 flex flex-1 justify-end lg:my-0">
							<Tabs
								value={selectedTab}
								onChange={handleTabChange}
							>
								<Tab
									label="Timeline"
									value="timeline"
								/>
								<Tab
									label="About"
									value="about"
								/>
								<Tab
									label="Photos & Videos"
									value="photos-videos"
								/>
							</Tabs>
						</div>
					</div>
				</div>
			}
			content={
				<div className="mx-auto flex w-full max-w-7xl flex-auto justify-center p-4 sm:p-8">
					{selectedTab === 'timeline' && <TimelineTab />}
					{selectedTab === 'about' && <AboutTab />}
					{selectedTab === 'photos-videos' && <PhotosVideosTab />}
				</div>
			}
			scroll="page"
		/>
	);
}

export default ProfileAppView;
