import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useProfileAbout } from '../../../../api/hooks/useProfileAbout';

/**
 * The about tab.
 */
function AboutTab() {
	const { data: profile, isLoading } = useProfileAbout();

	if (isLoading) {
		return <FuseLoading />;
	}

	const { general, work, contact, groups, friends } = profile;

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
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<div className="md:flex">
				<div className="flex flex-1 flex-col md:ltr:pr-8 md:rtl:pl-8">
					<Card
						component={motion.div}
						variants={item}
						className="mb-8 w-full"
					>
						<div className="px-8 pt-6">
							<Typography className="text-2xl leading-[1.25] font-semibold">
								General Information
							</Typography>
						</div>

						<CardContent className="px-8 py-6">
							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Gender</Typography>
								<Typography>{general.gender}</Typography>
							</div>

							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Birthday</Typography>
								<Typography>{general.birthday}</Typography>
							</div>

							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Locations</Typography>

								{general.locations.map((location) => (
									<div
										className="flex items-center"
										key={location}
									>
										<Typography>{location}</Typography>
										<FuseSvgIcon
											className="mx-1"
											size={16}
											color="action"
										>
											lucide:map-pin
										</FuseSvgIcon>
									</div>
								))}
							</div>

							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">About Me</Typography>
								<Typography>{general.about}</Typography>
							</div>
						</CardContent>
					</Card>

					<Card
						component={motion.div}
						variants={item}
						className="mb-8 w-full"
					>
						<div className="px-8 pt-6">
							<Typography className="text-2xl leading-[1.25] font-semibold">Work</Typography>
						</div>

						<CardContent className="px-8 py-6">
							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Occupation</Typography>
								<Typography>{work.occupation}</Typography>
							</div>

							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Skills</Typography>
								<Typography>{work.skills}</Typography>
							</div>

							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Jobs</Typography>
								<table>
									<tbody>
										{work.jobs.map((job) => (
											<tr key={job.company}>
												<td>
													<Typography>{job.company}</Typography>
												</td>
												<td className="px-4">
													<Typography color="text.secondary">{job.date}</Typography>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>

					<Card
						component={motion.div}
						variants={item}
						className="mb-8 w-full"
					>
						<div className="px-8 pt-6">
							<Typography className="text-2xl leading-[1.25] font-semibold">Contact</Typography>
						</div>

						<CardContent className="px-8 py-6">
							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Address</Typography>
								<Typography>{contact.address}</Typography>
							</div>

							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Tel.</Typography>

								{contact.tel.map((tel) => (
									<div
										className="flex items-center"
										key={tel}
									>
										<Typography>{tel}</Typography>
									</div>
								))}
							</div>

							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Website</Typography>

								{contact.websites.map((website) => (
									<div
										className="flex items-center"
										key={website}
									>
										<Typography>{website}</Typography>
									</div>
								))}
							</div>

							<div className="mb-6">
								<Typography className="mb-1 text-lg font-semibold">Emails</Typography>

								{contact.emails.map((email) => (
									<div
										className="flex items-center"
										key={email}
									>
										<Typography>{email}</Typography>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col md:w-80">
					<Card
						component={motion.div}
						variants={item}
						className="mb-8 w-full"
					>
						<div className="flex items-center px-8 pt-6">
							<Typography className="flex flex-1 text-2xl leading-[1.25] font-semibold">
								Friends
							</Typography>

							<Button
								className="-mx-2"
								size="small"
							>
								See 454 more
							</Button>
						</div>

						<CardContent className="flex flex-wrap px-8">
							{friends.map((friend) => (
								<Avatar
									key={friend.id}
									className="m-1 h-16 w-16 rounded-lg"
									src={friend.avatar}
									alt={friend.name}
								/>
							))}
						</CardContent>
					</Card>

					<Card
						component={motion.div}
						variants={item}
						className="mb-8 w-full rounded-xl shadow-sm"
					>
						<div className="flex items-center px-8 pt-6">
							<Typography className="flex flex-1 text-2xl leading-[1.25] font-semibold">
								Joined Groups
							</Typography>
							<div className="-mx-2">
								<Button
									color="inherit"
									size="small"
								>
									See 6 more
								</Button>
							</div>
						</div>
						<CardContent className="px-8">
							<List className="p-0">
								{groups.map((group) => (
									<ListItem
										key={group.id}
										className="gap-2 px-0"
										secondaryAction={
											<IconButton>
												<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
											</IconButton>
										}
										disableGutters
									>
										<Avatar alt={group.name}>{group.name[0]}</Avatar>
										<ListItemText
											primary={
												<div className="flex">
													<Typography
														className="font-medium"
														color="secondary.main"
														component="span"
													>
														{group.name}
													</Typography>

													<Typography
														className="mx-1 font-normal"
														component="span"
													>
														{group.category}
													</Typography>
												</div>
											}
											secondary={group.members}
										/>
									</ListItem>
								))}
							</List>
						</CardContent>
					</Card>
				</div>
			</div>
		</motion.div>
	);
}

export default AboutTab;
