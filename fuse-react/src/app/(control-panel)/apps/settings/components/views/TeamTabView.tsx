'use client';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTeamMembers } from '../../api/hooks/team/useTeamMembers';
import { useUpdateTeamMembers } from '../../api/hooks/team/useUpdateTeamMembers';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const roles = [
	{
		label: 'Read',
		value: 'read',
		description: 'Can read and clone this repository. Can also open and comment on issues and pull requests.'
	},
	{
		label: 'Write',
		value: 'write',
		description: 'Can read, clone, and push to this repository. Can also manage issues and pull requests.'
	},
	{
		label: 'Admin',
		value: 'admin',
		description:
			'Can read, clone, and push to this repository. Can also manage issues, pull requests, and repository settings, including adding collaborators.'
	}
];

function TeamTabView() {
	const { data: teamMembers } = useTeamMembers();
	const { mutate: updateTeamMembers } = useUpdateTeamMembers();

	function handleRemoveMember(email: string) {
		updateTeamMembers(teamMembers?.filter((member) => member.email !== email));
	}

	return (
		<div className="flex flex-col gap-4">
			<FormControl className="w-full">
				<FormLabel htmlFor="addTeamMember">Add team member</FormLabel>
				<TextField
					className="mb-2 w-full"
					placeholder="Enter email"
					id="addTeamMember"
					slotProps={{
						input: {
							startAdornment: <FuseSvgIcon color="action">lucide:user</FuseSvgIcon>,
							endAdornment: (
								<IconButton>
									<FuseSvgIcon color="action">lucide:circle-plus</FuseSvgIcon>
								</IconButton>
							)
						},
						inputLabel: {
							shrink: true
						}
					}}
				/>
			</FormControl>
			{teamMembers?.length === 0 && (
				<Typography
					className="my-8 text-center"
					color="textSecondary"
				>
					No team members found.
				</Typography>
			)}
			<List>
				{teamMembers?.map((member) => (
					<ListItem
						divider
						key={member.email}
						disablePadding
						className="py-3"
					>
						<div className="flex flex-1 items-center">
							<ListItemAvatar>
								<Avatar
									src={member.avatar}
									alt={`Avatar °${member.name}`}
								/>
							</ListItemAvatar>
							<ListItemText
								primary={member.name}
								secondary={member.email}
								classes={{ secondary: 'truncate' }}
							/>
						</div>

						<div className="flex items-center gap-1">
							<div>
								<Select
									sx={{
										'& .MuiSelect-select': {
											minHeight: '0!important'
										}
									}}
									value={member.role}
									size="small"
								>
									{roles.map((role) => (
										<MenuItem
											key={role.value}
											value={role.value}
										>
											{role.label}
										</MenuItem>
									))}
								</Select>
							</div>
							<IconButton onClick={() => handleRemoveMember(member.email)}>
								<FuseSvgIcon>lucide:trash</FuseSvgIcon>
							</IconButton>
						</div>
					</ListItem>
				))}
			</List>
		</div>
	);
}

export default TeamTabView;
