import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import _ from 'lodash';
import { WatchListItemType } from '../../../api/types/WatchlistType';
import ReactApexChart from 'react-apexcharts';

type WatchlistItemProps = {
	item: WatchListItemType;
};

/**
 * The watchlist item component.
 */
function WatchlistItem(props: WatchlistItemProps) {
	const { item } = props;
	const theme = useTheme();

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'line',
			sparkline: {
				enabled: true
			}
		},
		colors: item.trend.dir === 'up' ? [theme.palette.success.main] : [theme.palette.error.main],
		stroke: {
			curve: 'smooth',
			width: 2
		},
		tooltip: {
			theme: 'dark'
		},
		xaxis: {
			type: 'category'
		}
	};

	return (
		<div className="flex shrink-0 items-center gap-6 border-b p-5">
			<div className="flex flex-auto flex-col">
				<div className="flex items-baseline gap-1">
					<Typography
						className="text-md font-medium"
						color="text.secondary"
					>
						{item.title}
					</Typography>
					<Typography
						className="text-sm font-medium tracking-wider uppercase"
						color="text.secondary"
					>
						({item.iso})
					</Typography>
				</div>
				<div className="mt-2 flex items-end">
					<Typography className="min-w-20 font-mono text-2xl leading-none tracking-tighter">
						{item.amount.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</Typography>

					<FuseSvgIcon
						className={clsx(
							'icon-size-3.5 mx-0.5 mb-px',
							item.trend.dir === 'up' && 'text-green-500',
							item.trend.dir === 'down' && 'text-red-500'
						)}
						size={14}
					>
						{item.trend.dir === 'up' ? 'lucide:arrow-up' : 'lucide:arrow-down'}
					</FuseSvgIcon>
					<Typography
						className={clsx(
							'font-mono text-sm leading-none font-medium',
							item.trend.dir === 'up' && 'text-green-500',
							item.trend.dir === 'down' && 'text-red-500'
						)}
					>
						{item.trend.amount}%
					</Typography>
				</div>
			</div>
			<ReactApexChart
				className="h-9 w-full min-w-0 flex-auto"
				options={chartOptions}
				series={_.cloneDeep(item.series)}
				type={chartOptions?.chart?.type}
				height={chartOptions?.chart?.height}
			/>
		</div>
	);
}

export default WatchlistItem;
