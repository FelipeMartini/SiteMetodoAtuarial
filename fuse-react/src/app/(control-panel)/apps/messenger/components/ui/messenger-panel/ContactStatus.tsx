import { styled } from '@mui/material/styles';

const StyledStatus = styled('div')<{ value: string }>(({ theme }) => ({
	position: 'absolute',
	width: 12,
	height: 12,
	bottom: 4,
	left: 44,
	border: `2px solid ${theme.vars.palette.background.default}`,
	borderRadius: '50%',
	zIndex: 10,
	variants: [
		{
			props: {
				value: 'online'
			},
			style: {
				backgroundColor: '#4CAF50'
			}
		},
		{
			props: {
				value: 'do-not-disturb'
			},
			style: {
				backgroundColor: '#F44336'
			}
		},
		{
			props: {
				value: 'away'
			},
			style: {
				backgroundColor: '#FFC107'
			}
		},
		{
			props: {
				value: 'offline'
			},
			style: {
				backgroundColor: '#646464'
			}
		}
	]
}));

type ContactStatusProps = {
	value: 'online' | 'do-not-disturb' | 'away' | 'offline';
};

function ContactStatus(props: ContactStatusProps) {
	const { value } = props;

	return <StyledStatus value={value} />;
}

export default ContactStatus;
