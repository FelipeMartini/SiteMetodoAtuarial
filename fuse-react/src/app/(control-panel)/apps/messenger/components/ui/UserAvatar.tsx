import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import Statuses from './Statuses';
import { Contact } from '../../api/types';

const StyledBadge = styled(Badge)<{ statuscolor: string }>(({ theme, ...props }) => ({
	width: 36,
	height: 36,
	fontSize: 20,
	'& .MuiAvatar-root': {
		fontSize: 'inherit',
		color: theme.vars.palette.text.secondary,
		fontWeight: 600
	},
	'& .MuiBadge-badge': {
		backgroundColor: props.statuscolor,
		boxShadow: `0 0 0 2px ${theme.vars.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			content: '""'
		}
	}
}));

type UserAvatarPropsType = {
	user: PartialDeep<Contact>;
	className?: string;
};

/**
 * The user avatar component.
 */
function UserAvatar(props: UserAvatarPropsType) {
	const { user, className } = props;

	const status = _.find(Statuses, { value: user?.status });

	return (
		<StyledBadge
			className={className}
			overlap="circular"
			anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			variant="dot"
			statuscolor={status?.color}
		>
			<Avatar
				src={user?.avatar}
				alt={user?.name}
				className="h-full w-full"
			>
				{user?.name && (!user?.avatar || user?.avatar === '') ? user?.name[0] : ''}
			</Avatar>
		</StyledBadge>
	);
}

export default UserAvatar;
