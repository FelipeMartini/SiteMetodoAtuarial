import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import CurrentStatementWidgetType from '../../../api/types/CurrentStatementWidgetType';
import { useGetWidget } from '../../../api/hooks/widgets/useGetWidget';

/**
 * The CurrentStatementWidget widget.
 */
function CurrentStatementWidget() {
	const { data: widget, isLoading } = useGetWidget<CurrentStatementWidgetType>('currentStatement');

	const status = widget?.status;
	const date = widget?.date;
	const limit = widget?.limit;
	const spent = widget?.spent;
	const minimum = widget?.minimum;

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	return (
		<Paper className="relative flex flex-auto flex-col overflow-hidden rounded-xl shadow-sm">
			<div className="flex items-center justify-between px-2 pt-2">
				<div className="flex flex-col px-2">
					<Typography className="truncate text-lg leading-6 font-medium tracking-tight">
						Current Statement
					</Typography>
					{status === 'paid' && (
						<Typography className="text-sm font-medium text-green-600">Paid on {date}</Typography>
					)}
					{status === 'pending' && (
						<Typography className="text-sm font-medium text-red-600">Must be paid before {date}</Typography>
					)}
				</div>
				<div className="">
					<IconButton aria-label="more">
						<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
					</IconButton>
				</div>
			</div>
			<div className="flex flex-row flex-wrap gap-4 p-4">
				<div className="my-3 flex flex-col">
					<Typography
						color="text.secondary"
						className="text-sm leading-none font-medium"
					>
						Card Limit
					</Typography>
					<Typography className="mt-2 text-2xl leading-none font-medium md:text-3xl">
						{limit.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>
				</div>
				<div className="my-3 flex flex-col">
					<Typography
						color="text.secondary"
						className="text-sm leading-none font-medium"
					>
						Spent
					</Typography>
					<Typography className="mt-2 text-2xl leading-none font-medium md:text-3xl">
						{spent.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>
				</div>
				<div className="my-3 flex flex-col">
					<Typography
						color="text.secondary"
						className="text-sm leading-none font-medium"
					>
						Minimum
					</Typography>
					<Typography className="mt-2 text-2xl leading-none font-medium md:text-3xl">
						{minimum.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>
				</div>
			</div>

			<div className="absolute bottom-0 -m-6 h-24 w-24 opacity-50 ltr:right-0 rtl:left-0">
				{status === 'paid' && (
					<FuseSvgIcon
						size={96}
						color="disabled"
					>
						lucide:circle-check
					</FuseSvgIcon>
				)}

				{status === 'pending' && (
					<FuseSvgIcon
						size={96}
						color="disabled"
					>
						lucide:circle-alert
					</FuseSvgIcon>
				)}
			</div>
		</Paper>
	);
}

export default memo(CurrentStatementWidget);
