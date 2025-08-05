import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Paper from '@mui/material/Paper';
import { motion } from 'motion/react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetWidget } from '../../../../../api/hooks/widgets/useGetWidget';
import TeamMemberType from '../../../../../api/types/team/TeamMemberType';

/**
 * The TeamMembersWidget widget.
 */
function TeamMembersWidget() {
	const { data: widget, isLoading } = useGetWidget<TeamMemberType[]>('teamMembers');
	const members = widget;

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!members) {
		return null;
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
		>
			{members.map((member) => (
				<Paper
					component={motion.div}
					variants={item}
					className="flex flex-auto flex-col items-center overflow-hidden rounded-xl shadow-sm"
					key={member.id}
				>
					<div className="flex w-full flex-auto flex-col p-8 text-center">
						<div className="mx-auto h-32 w-32 overflow-hidden rounded-full">
							<img
								className="h-full w-full object-cover"
								src={member.avatar}
								alt="member"
							/>
						</div>
						<Typography className="mt-6 font-medium">{member.name}</Typography>
						<Typography color="text.secondary">{member.title}</Typography>
					</div>
					<div className="flex w-full items-center divide-x border-t">
						<a
							className="hover:bg-hover flex flex-auto items-center justify-center py-4"
							href={`mailto:${member.email}`}
							role="button"
						>
							<FuseSvgIcon color="action">lucide:mail</FuseSvgIcon>
							<Typography className="ml-2">Email</Typography>
						</a>
						<a
							className="hover:bg-hover flex flex-auto items-center justify-center py-4"
							href={`tel${member.phone}`}
							role="button"
						>
							<FuseSvgIcon color="action">lucide:phone</FuseSvgIcon>
							<Typography className="ml-2">Call</Typography>
						</a>
					</div>
				</Paper>
			))}
		</motion.div>
	);
}

export default memo(TeamMembersWidget);
