import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ApexOptions } from 'apexcharts';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from 'lodash';
import ExpensesDataType from '../../../../../api/types/budget/ExpensesDataType';
import { useGetWidget } from '../../../../../api/hooks/widgets/useGetWidget';
import ReactApexChart from 'react-apexcharts';

/**
 * The MonthlyExpensesWidget widget.
 */
function WeeklyExpensesWidget() {
	const { data: widget, isLoading } = useGetWidget<ExpensesDataType>('weeklyExpenses');

	const amount = widget?.amount;
	const series = widget?.series || [];
	const labels = widget?.labels;
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
		colors: [theme.palette.secondary.main],
		stroke: {
			curve: 'smooth',
			width: 2
		},
		tooltip: {
			theme: 'dark'
		},
		xaxis: {
			type: 'category',
			categories: labels
		},
		yaxis: {
			show: false,
			labels: {
				formatter: (val) => `$${val}`
			}
		}
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	if (!widget) {
		return null;
	}

	return (
		<Paper className="flex flex-auto flex-col overflow-hidden rounded-xl shadow-sm">
			<div className="flex items-center justify-between px-2 pt-2">
				<Typography
					className="truncate px-2 text-lg leading-6 font-medium tracking-tight"
					color="text.secondary"
				>
					Weekly Expenses
				</Typography>
				<div className="">
					<IconButton>
						<FuseSvgIcon>lucide:ellipsis-vertical</FuseSvgIcon>
					</IconButton>
				</div>
			</div>
			<div className="flex items-center p-4 pt-0">
				<div className="flex flex-col">
					<div className="text-3xl leading-[1.25] font-semibold tracking-tight">
						{amount.toLocaleString('en-US', {
							style: 'currency',
							currency: 'USD'
						})}
					</div>
					<div className="flex items-center">
						<FuseSvgIcon
							className="mr-1 text-green-500"
							size={20}
						>
							lucide:trending-down
						</FuseSvgIcon>
						<Typography className="text-secondary text-sm leading-none font-medium whitespace-nowrap">
							<span className="text-green-500">2%</span>
							<span> below projected</span>
						</Typography>
					</div>
				</div>
				<div className="ml-8 flex min-w-0 flex-auto flex-col">
					<ReactApexChart
						className="h-16 w-full"
						options={chartOptions}
						series={_.cloneDeep(series)}
						type={chartOptions?.chart?.type}
						height={chartOptions?.chart?.height}
					/>
				</div>
			</div>
		</Paper>
	);
}

export default WeeklyExpensesWidget;
