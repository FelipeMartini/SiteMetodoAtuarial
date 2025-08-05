import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import { ProfileActivity } from '../../../../api/types';
import ListItemAvatar from '@mui/material/ListItemAvatar';

type ActivityItemProps = {
	item: ProfileActivity;
};

/**
 * The activity item.
 */
function TimelineActivityItem(props: ActivityItemProps) {
	const { item } = props;

	return (
		<ListItem
			key={item.id}
			disableGutters
		>
			<ListItemAvatar>
				<Avatar
					alt={item.user.name}
					src={item.user.avatar}
				/>
			</ListItemAvatar>
			<ListItemText
				className="flex-1"
				primary={
					<div className="flex">
						<Typography
							className="font-normal whitespace-nowrap"
							color="secondary"
							paragraph={false}
						>
							{item.user.name}
						</Typography>

						<Typography
							className="truncate px-1"
							paragraph={false}
						>
							{item.message}
						</Typography>
					</div>
				}
				secondary={item.time}
			/>
		</ListItem>
	);
}

export default TimelineActivityItem;
