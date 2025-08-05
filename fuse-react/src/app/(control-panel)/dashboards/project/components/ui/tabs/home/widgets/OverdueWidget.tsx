import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import WidgetDataType from '../../../../../api/types/home/WidgetDataType';
import { useGetWidget } from '../../../../../api/hooks/widgets/useGetWidget';

/**
 * The OverdueWidget widget.
 */
function OverdueWidget() {
	const { data: widget, isLoading } = useGetWidget<WidgetDataType>('overdue');

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	const { data, title } = widget;

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl shadow-sm">
			<div className="flex items-center justify-between px-2 pt-2">
				<Typography
					className="truncate px-3 text-lg leading-6 font-medium tracking-tight"
					color="text.secondary"
				>
					{title}
				</Typography>
				<IconButton aria-label="more">
					<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
				</IconButton>
			</div>
			<div className="mt-4 text-center">
				<Typography className="text-7xl leading-none font-bold tracking-tight sm:text-8xl">
					{String(data.count)}
				</Typography>
				<Typography
					className="text-lg font-medium"
					color="text.secondary"
				>
					{data.name}
				</Typography>
			</div>
			<Typography
				className="mt-5 mb-6 flex w-full items-baseline justify-center gap-2"
				color="text.secondary"
			>
				<span className="truncate">{data.extra.name}:</span>
				<b>{String(data.extra.count)}</b>
			</Typography>
		</Paper>
	);
}

export default memo(OverdueWidget);
