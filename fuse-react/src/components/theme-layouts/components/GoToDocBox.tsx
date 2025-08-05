import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Link from '@fuse/core/Link';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

type GoToDocBoxProps = {
	className?: string;
};

function GoToDocBox(props: GoToDocBoxProps) {
	const { className } = props;
	return (
		<Box
			className={clsx('documentation-hero flex flex-col gap-2 rounded-sm border-1 px-3 py-2', className)}
			sx={{ backgroundColor: 'background.paper', borderColor: 'divider' }}
		>
			<Typography className="truncate">Need assistance to get started?</Typography>
			<Typography
				className="flex items-center gap-1 truncate"
				component={Link}
				to="/documentation"
				color="secondary"
			>
				View documentation <FuseSvgIcon>lucide:arrow-right</FuseSvgIcon>
			</Typography>
		</Box>
	);
}

export default GoToDocBox;
