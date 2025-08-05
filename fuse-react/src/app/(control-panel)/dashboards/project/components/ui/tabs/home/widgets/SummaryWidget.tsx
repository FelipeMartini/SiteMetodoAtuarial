import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { memo, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import WidgetDataType, { RangeType } from '../../../../../api/types/home/WidgetDataType';
import { useGetWidget } from '../../../../../api/hooks/widgets/useGetWidget';

/**
 * The SummaryWidget widget.
 */
function SummaryWidget() {
	const { data: widget, isLoading } = useGetWidget<WidgetDataType>('summary');

	const data = widget?.data;
	const ranges = widget?.ranges || [];
	const currentRangeDefault = widget?.currentRange;

	const [currentRange, setCurrentRange] = useState<RangeType>(currentRangeDefault as RangeType);

	function handleChangeRange(event: SelectChangeEvent<string>) {
		setCurrentRange(event.target.value as RangeType);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl shadow-sm">
			<div className="flex items-center justify-between px-2 pt-2">
				<Select
					className=""
					classes={{ select: 'py-0 flex items-center' }}
					value={currentRange}
					onChange={handleChangeRange}
					slotProps={{
						input: {
							name: 'currentRange'
						}
					}}
				>
					{Object.entries(ranges).map(([key, n]) => {
						return (
							<MenuItem
								key={key}
								value={key}
							>
								{n}
							</MenuItem>
						);
					})}
				</Select>
				<IconButton aria-label="more">
					<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
				</IconButton>
			</div>
			<div className="mt-4 text-center">
				<Typography className="text-7xl leading-none font-bold tracking-tight sm:text-8xl">
					{data.count[currentRange]}
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
				<b>{data.extra.count[currentRange]}</b>
			</Typography>
		</Paper>
	);
}

export default memo(SummaryWidget);
