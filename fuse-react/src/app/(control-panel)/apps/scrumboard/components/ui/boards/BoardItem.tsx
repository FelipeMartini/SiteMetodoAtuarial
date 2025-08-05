import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Card from '@mui/material/Card';
import { AvatarGroup } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { formatDistance } from 'date-fns';
import _ from 'lodash';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { ScrumboardBoard } from '../../../api/types';
import { useGetScrumboardMembers } from '../../../api/hooks/members/useGetScrumboardMembers';

type BoardItemProps = {
	board: ScrumboardBoard;
};

/**
 * The board item component.
 */
function BoardItem(props: BoardItemProps) {
	const { board } = props;

	const { data: members = [] } = useGetScrumboardMembers();

	const boardMembers = board?.members?.map((id) => _.find(members, (member) => member.id === id));

	return (
		<Card
			component={NavLinkAdapter}
			to={`/apps/scrumboard/boards/${board.id}`}
			role="button"
			className="flex h-full w-full flex-col items-start rounded-lg p-4 shadow-sm transition-shadow duration-150 ease-in-out hover:shadow-xl md:p-6"
		>
			<div className="flex w-full flex-auto flex-col items-start justify-start">
				<Box
					sx={{
						backgroundColor: (theme) => `rgba(${theme.vars.palette.secondary.mainChannel} / 0.2)`,
						color: 'secondary.main'
					}}
					className="flex items-center justify-center rounded-full p-4"
				>
					<FuseSvgIcon>{board.icon}</FuseSvgIcon>
				</Box>

				<Typography className="mt-5 text-lg leading-5 font-medium">{board.title}</Typography>

				<Typography className="text-secondary mt-0.5 line-clamp-2">{board.description}</Typography>

				<Divider className="mt-6 h-0.5 w-12" />
			</div>

			<div className="flex w-full flex-auto flex-col items-start justify-end">
				{Boolean(boardMembers?.length) && (
					<AvatarGroup max={4}>
						{boardMembers.map((member, index) => (
							<Avatar
								key={index}
								alt="member"
								src={member?.avatar}
							/>
						))}
					</AvatarGroup>
				)}

				<div className="text-md font-md mt-6 flex items-center">
					<Typography color="text.secondary">Edited:</Typography>
					<Typography className="mx-1 truncate">
						{formatDistance(new Date(board.lastActivity), new Date(), { addSuffix: true })}
					</Typography>
				</div>
			</div>
		</Card>
	);
}

export default BoardItem;
