import clsx from 'clsx';
import { memo } from 'react';
import { FuseNavBadgeType } from './types/FuseNavBadgeType';
import Chip from '@mui/material/Chip';

type FuseNavBadgeProps = {
	className?: string;
	classes?: string;
	badge: FuseNavBadgeType;
};

/**
 * FuseNavBadge component.
 * This component will render a badge on a FuseNav element. It accepts a `FuseNavBadgeType` as a prop,
 * which is an object containing a title and background and foreground colour.
 */
function FuseNavBadge(props: FuseNavBadgeProps) {
	const { className = '', badge } = props;

	return (
		<Chip
			className={clsx('item-badge truncate text-xs leading-none font-bold', className)}
			size="small"
			color="secondary"
			sx={{
				backgroundColor: badge.bg,
				color: badge.fg
			}}
			label={badge.title}
		/>
	);
}

export default memo(FuseNavBadge);
