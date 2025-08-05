import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { fromUnixTime } from 'date-fns/fromUnixTime';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import Box from '@mui/material/Box';
import { ScrumboardComment } from '../../../../../api/types';
import { useGetScrumboardMember } from '../../../../../api/hooks/members/useGetScrumboardMember';

type CardActivityProps = {
	item: ScrumboardComment;
};

/**
 * The card activity component.
 */
function CardActivity(props: CardActivityProps) {
	const { item } = props;
	const { data: user } = useGetScrumboardMember(item.idMember);

	switch (item.type) {
		case 'comment': {
			return (
				<ListItem
					dense
					className="px-0"
				>
					<Avatar
						alt={user?.name}
						src={user?.avatar}
						className="h-8 w-8"
					/>
					<Box
						className="mx-4 flex flex-col p-3"
						sx={(theme) => ({
							borderRadius: '5px 20px 20px 5px',
							border: `1px solid ${theme.vars.palette.divider}`
						})}
					>
						<div className="flex items-center">
							<Typography>{user?.name}</Typography>
							<Typography
								className="text-md mx-2"
								color="text.secondary"
							>
								{formatDistanceToNow(fromUnixTime(item.time), { addSuffix: true })}
							</Typography>
						</div>
						<Typography>{item.message}</Typography>
					</Box>
				</ListItem>
			);
		}
		case 'attachment': {
			return (
				<ListItem
					dense
					className="px-0"
				>
					<Avatar
						alt={user?.name}
						src={user?.avatar}
						className="h-8 w-8"
					/>
					<div className="mx-4 flex items-center">
						<Typography>{user?.name},</Typography>
						<Typography className="mx-2">{item.message}</Typography>
						<Typography
							className="text-md"
							color="text.secondary"
						>
							{formatDistanceToNow(fromUnixTime(item.time), { addSuffix: true })}
						</Typography>
					</div>
				</ListItem>
			);
		}
		default: {
			return null;
		}
	}
}

export default CardActivity;
