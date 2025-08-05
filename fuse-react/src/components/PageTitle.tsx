import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Chip } from '@mui/material';
import clsx from 'clsx';
import { ReactNode } from 'react';
import Link from '@fuse/core/Link';

export type PageTitleProps = {
	className?: string;
	title?: string;
	subtitle?: string;
	backUrl?: string;
	backTitle?: string;
	badgeTitle?: string | ReactNode;
};

function PageTitle(props: PageTitleProps) {
	const { className = '', title, subtitle, backUrl, backTitle, badgeTitle } = props;

	return (
		<div className={clsx('flex flex-col justify-between', className)}>
			{backUrl && backTitle && (
				<Typography
					className="mb-px flex items-center gap-0.25 leading-none"
					component={Link}
					to={backUrl}
					role="button"
					color="text.secondary"
				>
					<FuseSvgIcon>remix:arrow-left-line</FuseSvgIcon>
					<span>{backTitle}</span>
				</Typography>
			)}
			<div className="flex items-center gap-1">
				{title && <Typography className="truncate text-xl font-bold">{title}</Typography>}
				{badgeTitle && badgeTitle !== '' && (
					<Chip
						className="truncate rounded-md"
						label={badgeTitle}
						color="secondary"
						size="small"
					/>
				)}
			</div>
			{subtitle && (
				<Typography
					className="truncate"
					color="text.secondary"
				>
					{subtitle}
				</Typography>
			)}
		</div>
	);
}

export default PageTitle;
